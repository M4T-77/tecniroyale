import axios from 'axios';
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ImageWithLoader from '../components/ImageWithLoader';
import { Link } from 'expo-router';

const getRaceClass = (race: string): string => {
    return race.toLowerCase().replace(' ', '-') || 'default-race';
};

interface Character {
  id: number;
  name: string;
  image: string;
  race: string;
}

const Index = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://dragonball-api.com/api/characters?limit=100`);
      if (response.status !== 200) throw new Error('Error al buscar personajes');
      const data = response.data;
      if (!data.items || data.items.length === 0) throw new Error('No se encontraron personajes en la API.');

      setCharacters(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-sky-400">
      <View className="w-full p-2 items-center">
        <Text className="text-5xl font-black text-yellow-400 mt-16 mb-5 text-center">
          Personajes de Dragon Ball
        </Text>

        {loading && <ActivityIndicator size="large" className="mt-8 text-amber-500" />}
        {error && <Text className="text-red-700 bg-white/80 rounded-lg p-4 mt-5 text-lg font-bold shadow-lg">{error}</Text>}

        <View className="flex-row flex-wrap justify-center w-full">
          {characters.map((character) => {
            const raceClass = getRaceClass(character.race);
            return (
              <View key={character.id} className="w-1/2 p-1">
                <Link href={`/character/${character.id}`} asChild>
                  <TouchableOpacity 
                    className={`border-2 rounded-lg border-${raceClass} bg-${raceClass}/25`}
                  >
                    <ImageWithLoader
                      source={{ uri: character.image }}
                      containerClassName="w-full h-40"
                      resizeMode="contain"
                    />
                    <Text className="text-white text-center p-1.5 font-bold">
                      {character.name}
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
