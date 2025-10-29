import { useEffect, useState } from "react";
import { Text, View, Image, TextInput, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";

// La interfaz se ha actualizado para coincidir con la nueva API
interface Character {
  id: number; // La nueva API proporciona un ID para cada personaje
  name: string;
  race: string;
  ki: string;
  image: string; // La nueva API usa 'image' en lugar de 'imageUrl'
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
      // Usamos la API de la documentación con un límite para obtener todos los personajes
      const response = await fetch(`https://dragonball-api.com/api/characters?limit=100`);
      
      if (!response.ok) {
        throw new Error('Error al buscar personajes');
      }
      
      const data = await response.json();
      
      // La respuesta de la API tiene los personajes en la propiedad 'items'
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
          <TextInput
            className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-l-lg p-4 text-lg focus:border-yellow-400"
            placeholder="Buscar personaje..."
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            className="bg-yellow-400 p-4 rounded-r-lg justify-center items-center"
            onPress={handleSearch}
            disabled={loading}
          >
            <Text className="text-slate-900 font-bold text-lg">Buscar</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full max-w-md items-center">
          {loading && <ActivityIndicator size="large" color="#facc15" className="mt-8" />}
          {error && <Text className="text-red-400 mt-5 text-lg font-semibold">{error}</Text>}
          
          {characters.length > 0 && (
            <View className="w-full items-center">
              {characters.map((character) => (
                <View 
                  key={character.id} // Usamos el id del personaje como clave
                  className="items-center my-8 w-full max-w-sm"
                >
                  <Text className="text-3xl font-bold text-white text-center mb-4">{character.name}</Text>
                  
                  <Image
                    source={{ uri: character.image }} // Usamos 'image' de la nueva API
                    className="w-full h-96"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-lg mt-4">Raza: {character.race}</Text>
                  <Text className="text-white text-lg">Ki: {character.ki}</Text>
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
