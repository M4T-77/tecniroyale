import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import IconButton from '../components/IconButton';
import TextField from '../components/TextField';

// La interfaz se ha ampliado para incluir todas las características del personaje
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
}

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('Goku');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCharacter = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://dragonball-api.com/api/characters?limit=100`);
      
      if (!response.ok) {
        throw new Error('Error al buscar personajes');
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const filteredCharacters = data.items.filter((character: Character) => 
          character.name.toLowerCase().includes(name.toLowerCase())
        );

        if (filteredCharacters.length > 0) {
          setCharacters(filteredCharacters);
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
              {characters.map((character) => (
                <View 
                  key={character.id}
                  className="items-center my-8 w-full max-w-sm bg-slate-800/50 p-6 rounded-xl"
                >
                  <Text className="text-3xl font-bold text-white text-center mb-4">{character.name}</Text>
                  
                  <Image
                    source={{ uri: character.image }}
                    className="w-full h-96"
                    resizeMode="contain"
                  />
                  
                  {/* Contenedor para las estadísticas del personaje */}
                  <View className="w-full mt-6">
                    <Text className="text-white text-lg mb-2"><Text className="font-bold">Raza:</Text> {character.race}</Text>
                    <Text className="text-white text-lg mb-2"><Text className="font-bold">Ki:</Text> {character.ki}</Text>
                    <Text className="text-white text-lg mb-2"><Text className="font-bold">Ki Máximo:</Text> {character.maxKi}</Text>
                    <Text className="text-white text-lg mb-2"><Text className="font-bold">Género:</Text> {character.gender}</Text>
                    <Text className="text-white text-lg mb-4"><Text className="font-bold">Afiliación:</Text> {character.affiliation}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
