import axios from 'axios';
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import IconButton from '../components/IconButton';
import ImageWithLoader from '../components/ImageWithLoader';
import TextField from '../components/TextField';

const getRaceColor = (race: string): string => {
    const raceColors: { [key: string]: string } = {
        'saiyan': '#c5a355',
        'human': '#6a9fcf',
        'namekian': '#6aab75',
        'frieza race': '#9b7bb6',
        'android': '#95a5a6',
        'majin': '#e58b8b',
        'jiren race': '#c07065',
        'god': '#6a9fcf',
        'angel': '#b39bc8',
        'evil': '#c07065',
    };
    return raceColors[race.toLowerCase()] || '#5f7385';
};

const isColorLight = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128;
};

const formatKi = (ki: string): string => {
    if (!ki) return "0";
    return ki.replace(/\B(?=(\d{3})+(?!\\d))/g, ",");
};

interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

interface Character {
  id: number;
  name: string;
  race: string;
  ki: string;
  maxKi: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  transformations: Transformation[];
}

interface DisplayCharacter {
  character: Character;
  currentTransformationIndex: number;
}

const Index = () => {
  const [characters, setCharacters] = useState<DisplayCharacter[]>([]);
  const [searchTerm, setSearchTerm] = useState('Goku');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCharacter = async (name: string) => {
    setLoading(true);
    setError(null);
    setCharacters([]);
    try {
      const response = await axios.get(`https://dragonball-api.com/api/characters?limit=100`);
      if (response.status !== 200) throw new Error('Error al buscar personajes');
      
      const data = response.data;
      if (!data.items || data.items.length === 0) throw new Error('No se encontraron personajes en la API.');

      const filteredCharacters = data.items.filter((char: any) => 
        char.name.toLowerCase().includes(name.toLowerCase())
      );

      if (filteredCharacters.length > 0) {
        const detailedCharacters = await Promise.all(
          filteredCharacters.map(char => 
            axios.get(`https://dragonball-api.com/api/characters/${char.id}`).then(res => res.data)
          )
        );
        const displayChars: DisplayCharacter[] = detailedCharacters.map(char => ({
            character: char,
            currentTransformationIndex: -1
        }));
        setCharacters(displayChars);
      } else {
        throw new Error(`No se encontraron personajes que coincidan con "${name}".`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCharacter('Goku');
  }, []);

  const handleSearch = () => {
    if(searchTerm.trim()) searchCharacter(searchTerm);
  };

  const handleTransformationChange = (charIndex: number, direction: number) => {
    setCharacters(prev => 
      prev.map((displayChar, index) => {
        if (index === charIndex) {
          const newIndex = displayChar.currentTransformationIndex + direction;
          if (newIndex >= -1 && newIndex < displayChar.character.transformations.length) {
            return { ...displayChar, currentTransformationIndex: newIndex };
          }
        }
        return displayChar;
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} className="bg-white">
      <View className="w-full p-5 items-center">
        
        <Text className="text-4xl font-bold text-gray-800 mt-16 mb-10 text-center">
          Buscador de Personajes de Dragon Ball
        </Text>

        <View className="flex-row w-full max-w-md mb-8">
          <TextField
            placeholder="Buscar personaje..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <IconButton 
            text="Buscar"
            onPress={handleSearch}
            disabled={loading}
          />
        </View>

        <View className="w-full max-w-md items-center">
          {loading && <ActivityIndicator size="large" color="#3b82f6" className="mt-8" />}
          {error && <Text className="text-red-500 mt-5 text-lg font-semibold">{error}</Text>}
          
          {characters.map((displayChar, index) => {
            const { character, currentTransformationIndex } = displayChar;
            const transformation = currentTransformationIndex >= 0 ? character.transformations[currentTransformationIndex] : null;

            const displayName = transformation?.name || character.name;
            const displayImage = transformation?.image || character.image;
            const displayKi = transformation?.ki || character.ki;

            const raceColor = getRaceColor(character.race);
            const textColorClass = isColorLight(raceColor) ? 'text-gray-800' : 'text-gray-100';
            const boldTextColorClass = isColorLight(raceColor) ? 'text-black' : 'text-white';

            return (
              <View 
                key={character.id}
                className="items-center my-6 w-full max-w-sm p-6 rounded-2xl shadow-lg border border-gray-200"
                style={{ backgroundColor: raceColor }}
              >
                <Text className={`text-3xl font-bold text-center mb-4 ${boldTextColorClass}`}>{displayName}</Text>
                
                <ImageWithLoader
                  source={{ uri: displayImage }}
                  className="w-full h-96"
                  resizeMode="contain"
                />

                {character.transformations?.length > 0 && (
                    <View className="flex-row justify-between items-center w-full my-4">
                        <TouchableOpacity 
                            onPress={() => handleTransformationChange(index, -1)} 
                            disabled={currentTransformationIndex < 0}
                            className="p-3 bg-black/25 rounded-lg border border-white/20 active:bg-black/40 disabled:opacity-50"
                        >
                            <Text className={`font-bold ${boldTextColorClass}`}>Anterior</Text>
                        </TouchableOpacity>

                        <Text className={`font-bold text-lg ${boldTextColorClass}`}>
                            {transformation ? transformation.name : "Base"}
                        </Text>

                        <TouchableOpacity 
                            onPress={() => handleTransformationChange(index, 1)} 
                            disabled={currentTransformationIndex >= character.transformations.length - 1}
                            className="p-3 bg-black/25 rounded-lg border border-white/20 active:bg-black/40 disabled:opacity-50"
                        >
                            <Text className={`font-bold ${boldTextColorClass}`}>Siguiente</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                <View className="w-full mt-4 bg-black/20 p-4 rounded-lg">
                  <Text className={`${textColorClass} text-lg mb-2`}><Text className={`font-bold ${boldTextColorClass}`}>Raza:</Text> {character.race}</Text>
                  <Text className={`${textColorClass} text-lg mb-2`}><Text className={`font-bold ${boldTextColorClass}`}>Ki:</Text> {formatKi(displayKi)}</Text>
                  <Text className={`${textColorClass} text-lg mb-2`}><Text className={`font-bold ${boldTextColorClass}`}>Ki Máximo:</Text> {formatKi(character.maxKi)}</Text>
                  <Text className={`${textColorClass} text-lg mb-2`}><Text className={`font-bold ${boldTextColorClass}`}>Género:</Text> {character.gender}</Text>
                  <Text className={`${textColorClass} text-lg mb-4`}><Text className={`font-bold ${boldTextColorClass}`}>Afiliación:</Text> {character.affiliation}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;

