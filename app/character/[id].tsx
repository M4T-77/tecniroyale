import axios from 'axios';
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import ImageWithLoader from '../../components/ImageWithLoader';

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

const formatKi = (ki: string): string => {
    if (!ki) return "0";
    return ki.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

const CharacterDetail = () => {
    const { id } = useLocalSearchParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [currentTransformationIndex, setCurrentTransformationIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCharacter = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://dragonball-api.com/api/characters/${id}`);
            if (response.status !== 200) throw new Error('Error al buscar el personaje');
            setCharacter(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCharacter();
    }, [id]);

    const handleTransformationChange = (direction: number) => {
        if (!character) return;
        const newIndex = currentTransformationIndex + direction;
        if (newIndex >= -1 && newIndex < character.transformations.length) {
            setCurrentTransformationIndex(newIndex);
        }
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-sky-400"><ActivityIndicator size="large" color="#f59e0b" /></View>;
    if (error) return <View className="flex-1 justify-center items-center bg-sky-400"><Text className="text-red-700 bg-white/80 rounded-lg p-4 text-lg font-bold shadow-lg">{error}</Text></View>;
    if (!character) return null;

    const transformation = currentTransformationIndex >= 0 ? character.transformations[currentTransformationIndex] : null;
    const displayName = transformation?.name || character.name;
    const displayImage = transformation?.image || character.image;
    const displayKi = transformation?.ki || character.ki;
    const raceColor = getRaceColor(character.race);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} className="bg-sky-400">
            <View className="w-full p-5 items-center">
                <View className="w-full max-w-sm">
                    <Link href="/" asChild>
                        <TouchableOpacity className="absolute top-10 left-2 bg-white/80 rounded-full p-2 z-10">
                            <Text className="text-black text-2xl">‹ Volver</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <View className="my-8 w-full max-w-sm mt-24">
                    <View
                        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl"
                        style={{
                            borderColor: raceColor,
                            borderWidth: 4,
                            shadowColor: raceColor,
                        }}
                    >
                        <View className="items-center p-6">
                            <Text className={`text-4xl font-black text-center mb-4`} style={{ color: raceColor }}>
                                {displayName}
                            </Text>

                            <View className="w-full h-96 rounded-2xl overflow-hidden border-2" style={{ borderColor: raceColor }}>
                                <ImageWithLoader
                                    source={{ uri: displayImage }}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>

                            {character.transformations?.length > 0 && (
                                <View className="flex-row justify-between items-center w-full my-4">
                                    <TouchableOpacity
                                        onPress={() => handleTransformationChange(-1)}
                                        disabled={currentTransformationIndex < 0}
                                        style={{ backgroundColor: raceColor }}
                                        className="py-2 px-5 rounded-full border-2 border-white/50 active:opacity-80 disabled:opacity-50 shadow-lg"
                                    >
                                        <Text className="text-white font-bold text-lg">‹</Text>
                                    </TouchableOpacity>

                                    <Text className="font-bold text-xl mx-2 text-center flex-1" style={{ color: raceColor }}>
                                        {transformation ? transformation.name : "Base"}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => handleTransformationChange(1)}
                                        disabled={currentTransformationIndex >= character.transformations.length - 1}
                                        style={{ backgroundColor: raceColor }}
                                        className="py-2 px-5 rounded-full border-2 border-white/50 active:opacity-80 disabled:opacity-50 shadow-lg"
                                    >
                                        <Text className="text-white font-bold text-lg">›</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View className="w-full mt-2 bg-black/15 p-4 rounded-xl">
                                <Text className="text-gray-900 text-lg mb-2"><Text className="font-bold" style={{ color: raceColor }}>Raza:</Text> {character.race}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className="font-bold" style={{ color: raceColor }}>Ki:</Text> {formatKi(displayKi)}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className="font-bold" style={{ color: raceColor }}>Ki Máximo:</Text> {formatKi(character.maxKi)}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className="font-bold" style={{ color: raceColor }}>Género:</Text> {character.gender}</Text>
                                <Text className="text-gray-900 text-lg"><Text className="font-bold" style={{ color: raceColor }}>Afiliación:</Text> {character.affiliation}</Text>

                                <View className="border-t border-black/20 my-3" />

                                <Text className="text-gray-800 text-base italic">{character.description}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default CharacterDetail;
