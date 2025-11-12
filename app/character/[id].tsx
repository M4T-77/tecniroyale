import axios from 'axios';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import ImageWithLoader from '../../components/ImageWithLoader';
import { GoogleGenAI } from "@google/genai";
import * as Speech from 'expo-speech';

const getRaceClass = (race: string): string => {
    return race.toLowerCase().replace(' ', '-') || 'default-race';
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
    const [aiDescription, setAiDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

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

    const generateDescription = async () => {
        if (!character) return;

        const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        if (!API_KEY) {
            Alert.alert("Error", "No se encontró la API Key. Verifica tu archivo .env");
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const prompt = `Genera una descripción para el personaje de Dragon Ball llamado ${character.name}. Ya tengo la siguiente información: Raza: ${character.race}, Ki: ${character.ki}, Género: ${character.gender}, Afiliación: ${character.affiliation}. Proporciona detalles sobre su historia, personalidad o habilidades. IMPORTANTE: Tu respuesta debe ser solo la descripción, sin saludos, sin encabezados y sin repetir la información que te di.`;

            const res = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Responde siempre en español: ${prompt}`,
            });

            if (res.text != undefined) {
                setAiDescription(res.text);
            } else {
                setAiDescription("No se pudo obtener la respuesta");
            }
        } catch (err) {
            console.log(err);
            setGenerationError("Error al consultar a Gemini. Verifica tu API key.");
        } finally {
            setIsGenerating(false);
        }
    };

    const speakDescription = async () => {
        if (!aiDescription) return;

        const speaking = await Speech.isSpeakingAsync();
        if (speaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        Speech.speak(aiDescription, {
            language: 'es-ES',
            onStart: () => setIsSpeaking(true),
            onDone: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);


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

    if (loading) return <View className="flex-1 justify-center items-center bg-sky-400"><ActivityIndicator size="large" className="text-amber-500" /></View>;
    if (error) return <View className="flex-1 justify-center items-center bg-sky-400"><Text className="text-red-700 bg-white/80 rounded-lg p-4 text-lg font-bold shadow-lg">{error}</Text></View>;
    if (!character) return null;

    const transformation = currentTransformationIndex >= 0 ? character.transformations[currentTransformationIndex] : null;
    const displayName = transformation?.name || character.name;
    const displayImage = transformation?.image || character.image;
    const displayKi = transformation?.ki || character.ki;
    const raceClass = getRaceClass(character.race);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} className={`bg-${raceClass}-400`}>
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
                        className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-${raceClass} shadow-${raceClass}`}>
                        <View className="items-center p-6">
                            <Text className={`text-4xl font-black text-center mb-4 text-${raceClass}`}>
                                {displayName}
                            </Text>

                            <View className={`w-full h-96 rounded-2xl overflow-hidden border-2 border-${raceClass}`}>
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
                                        className={`py-2 px-5 rounded-full border-2 border-white/50 active:opacity-80 disabled:opacity-50 shadow-lg bg-${raceClass}`}>
                                        <Text className="text-white font-bold text-lg">‹</Text>
                                    </TouchableOpacity>

                                    <Text className={`font-bold text-xl mx-2 text-center flex-1 text-${raceClass}`}>
                                        {transformation ? transformation.name : "Base"}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => handleTransformationChange(1)}
                                        disabled={currentTransformationIndex >= character.transformations.length - 1}
                                        className={`py-2 px-5 rounded-full border-2 border-white/50 active:opacity-80 disabled:opacity-50 shadow-lg bg-${raceClass}`}>
                                        <Text className="text-white font-bold text-lg">›</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View className="w-full mt-2 bg-black/15 p-4 rounded-xl">
                                <Text className="text-gray-900 text-lg mb-2"><Text className={`font-bold text-${raceClass}`}>Raza:</Text> {character.race}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className={`font-bold text-${raceClass}`}>Ki:</Text> {formatKi(displayKi)}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className={`font-bold text-${raceClass}`}>Ki Máximo:</Text> {formatKi(character.maxKi)}</Text>
                                <Text className="text-gray-900 text-lg mb-2"><Text className={`font-bold text-${raceClass}`}>Género:</Text> {character.gender}</Text>
                                <Text className="text-gray-900 text-lg"><Text className={`font-bold text-${raceClass}`}>Afiliación:</Text> {character.affiliation}</Text>

                                <View className="border-t border-black/20 my-3" />

                                <TouchableOpacity
                                    onPress={generateDescription}
                                    disabled={isGenerating}
                                    className={`py-2 px-5 rounded-full self-center my-2 active:opacity-80 disabled:opacity-50 shadow-lg bg-${raceClass}`}>
                                    <Text className="text-white font-bold text-lg">
                                        {isGenerating ? "Generando..." : "Generar descripción con IA"}
                                    </Text>
                                </TouchableOpacity>

                                {isGenerating && <ActivityIndicator size="small" className={`my-2 text-${raceClass}`} />}

                                {generationError && (
                                    <Text className="text-red-600 text-center my-2">{generationError}</Text>
                                )}

                                {aiDescription ? (
                                     <View className="items-center w-full">
                                         <Text className="text-gray-800 text-base italic mt-2 text-center">{aiDescription}</Text>
                                         <TouchableOpacity
                                             onPress={speakDescription}
                                             className={`py-2 px-5 rounded-full self-center my-2 active:opacity-80 shadow-lg bg-${raceClass}`}>
                                             <Text className="text-white font-bold text-lg">
                                                 {isSpeaking ? "Detener" : "Leer descripción"}
                                             </Text>
                                         </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text className="text-gray-800 text-base italic text-center">Haz click en el botón para generar una descripción con IA.</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default CharacterDetail;
