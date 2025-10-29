import { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import TextField from '../components/TextField';
import IconButton from '../components/IconButton';

// Interfaz para las transformaciones
interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

// Interfaz del personaje actualizada para incluir transformaciones
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

// Interfaz para manejar el estado de visualización del personaje
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
      const response = await fetch(`https://dragonball-api.com/api/characters?limit=100`);
      
      if (!response.ok) {
        throw new Error('Error al buscar personajes');
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const filteredCharacters = data.items.filter((character: any) => 
          character.name.toLowerCase().includes(name.toLowerCase())
        );

        if (filteredCharacters.length > 0) {
          const detailedCharacters = await Promise.all(
            filteredCharacters.map(async (char: any) => {
              const res = await fetch(`https://dragonball-api.com/api/characters/${char.id}`);
              return res.json();
            })
          );

          const displayChars: DisplayCharacter[] = detailedCharacters.map((char: Character) => ({
              character: char,
              currentTransformationIndex: -1 // -1 representa la forma base
          }));
          setCharacters(displayChars);
        } else {
          setCharacters([]);
          throw new Error(`No se encontraron personajes que coincidan con "${name}".`);
        }
      } else {
        setCharacters([]);
        throw new Error('No se encontraron personajes en la respuesta de la API.');
      }
    } catch (err) {
      setCharacters([]);
      setError(err instanceof Error ? err.message : 'Ocurrió un error durante la búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCharacter('Goku');
  }, []);

  const handleSearch = () => {
    if(searchTerm.trim()) {
      searchCharacter(searchTerm);
    }
  };

  const handleTransformationChange = (characterIndex: number, direction: number) => {
    setCharacters(prev => {
        const newChars = [...prev];
        const current = newChars[characterIndex];
        const newIndex = current.currentTransformationIndex + direction;

        if (newIndex >= -1 && newIndex < current.character.transformations.length) {
            newChars[characterIndex] = { ...current, currentTransformationIndex: newIndex };
        }
        
        return newChars;
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: '#1e293b' }}>
      <View className="w-full p-5 items-center">
        
        <Text className="text-5xl font-extrabold text-yellow-400 mt-12 mb-8 shadow-md">
          Buscador de Dragon Ball
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
          {loading && <ActivityIndicator size="large" color="#facc15" className="mt-8" />}
          {error && <Text className="text-red-400 mt-5 text-lg font-semibold">{error}</Text>}
          
          {characters.length > 0 && (
            <View className="w-full items-center">
              {characters.map((displayChar, index) => {
                const { character, currentTransformationIndex } = displayChar;
                const transformation = currentTransformationIndex >= 0 ? character.transformations[currentTransformationIndex] : null;

                const displayName = transformation ? transformation.name : character.name;
                const displayImage = transformation ? transformation.image : character.image;
                const displayKi = transformation ? transformation.ki : character.ki;

                return (
                  <View 
                    key={character.id}
                    className="items-center my-8 w-full max-w-sm bg-slate-800/50 p-6 rounded-xl"
                  >
                    <Text className="text-3xl font-bold text-white text-center mb-4">{displayName}</Text>
                    
                    <Image
                      source={{ uri: displayImage }}
                      className="w-full h-96"
                      resizeMode="contain"
                    />

                    {character.transformations && character.transformations.length > 0 && (
                        <View className="flex-row justify-between items-center w-full my-4">
                            <TouchableOpacity 
                                onPress={() => handleTransformationChange(index, -1)} 
                                disabled={currentTransformationIndex < 0}
                                className="p-2 bg-yellow-400 rounded-md"
                                style={{ opacity: currentTransformationIndex < 0 ? 0.5 : 1 }}
                            >
                                <Text className="text-slate-900 font-bold">Anterior</Text>
                            </TouchableOpacity>

                            <Text className="text-white font-bold text-lg">
                                {transformation ? transformation.name : "Base"}
                            </Text>

                            <TouchableOpacity 
                                onPress={() => handleTransformationChange(index, 1)} 
                                disabled={currentTransformationIndex >= character.transformations.length - 1}
                                className="p-2 bg-yellow-400 rounded-md"
                                style={{ opacity: currentTransformationIndex >= character.transformations.length - 1 ? 0.5 : 1 }}
                            >
                                <Text className="text-slate-900 font-bold">Siguiente</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    
                    <View className="w-full mt-6">
                      <Text className="text-white text-lg mb-2"><Text className="font-bold">Raza:</Text> {character.race}</Text>
                      <Text className="text-white text-lg mb-2"><Text className="font-bold">Ki:</Text> {displayKi}</Text>
                      <Text className="text-white text-lg mb-2"><Text className="font-bold">Ki Máximo:</Text> {character.maxKi}</Text>
                      <Text className="text-white text-lg mb-2"><Text className="font-bold">Género:</Text> {character.gender}</Text>
                      <Text className="text-white text-lg mb-4"><Text className="font-bold">Afiliación:</Text> {character.affiliation}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
