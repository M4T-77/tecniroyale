import { useEffect, useState } from "react";
import { Text, View, Image, TextInput, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";

interface Jugador {
  nombre: string;
  posicion: string;
  club: string;
  nacionalidad: string;
  foto: string;
}

const Index = () => {
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('Kaka');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarJugador = async (nombre: string) => {
    setCargando(true);
    setError(null);
    setJugador(null);
    
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(nombre)}`);
      
      if (!response.ok) {
        throw new Error('Jugador no encontrado');
      }
      
      const data = await response.json();
      
      if (data.player && data.player.length > 0) {
        const playerData = data.player[0];
        setJugador({
          nombre: playerData.strPlayer,
          posicion: playerData.strPosition,
          club: playerData.strTeam,
          nacionalidad: playerData.strNationality,
          foto: playerData.strCutout || playerData.strThumb || 'https://via.placeholder.com/200',
        });
      } else {
        throw new Error('Jugador no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    buscarJugador('Kaka');
  }, []);

  const handleBusqueda = () => {
    if(terminoBusqueda.trim()) {
      buscarJugador(terminoBusqueda);
    }
  };

  return (
    <View className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-5 pt-20">
          <Text className="text-4xl font-extrabold text-cyan-400 mb-4 text-center">Buscador de Jugadores</Text>
          
          <View className="w-full max-w-sm">
            <TextInput
              className="h-14 border-2 border-slate-600 rounded-xl w-full mt-5 px-4 bg-slate-800 text-white text-lg"
              onChangeText={setTerminoBusqueda}
              value={terminoBusqueda}
              placeholder="Ej: Messi, Ronaldo"
              placeholderTextColor="#9ca3af"
              onSubmitEditing={handleBusqueda}
            />
            
            <TouchableOpacity 
              className="bg-cyan-500 active:bg-cyan-600 rounded-xl py-3 px-8 mt-4 shadow-lg w-full"
              onPress={handleBusqueda} 
            >
              <Text className="text-slate-900 font-bold text-xl text-center">Buscar</Text>
            </TouchableOpacity>
          </View>

          {cargando && <ActivityIndicator size="large" color="#22d3ee" className="mt-8" />}
          {error && <Text className="text-red-400 mt-5 text-lg font-semibold">{error}</Text>}
          
          {jugador && (
            <View className="items-center mt-8 bg-slate-800/80 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
              <Text className="text-3xl font-bold text-white text-center">{jugador.nombre}</Text>
              
              <Image
                source={{ uri: jugador.foto }}
                className="w-48 h-48 mt-4 rounded-full border-4 border-cyan-400"
                resizeMode="cover"
              />

              <View className="mt-5 self-start w-full">
                <Text className="text-xl text-white my-1">
                  <Text className="font-bold text-cyan-400">Posición:</Text> {jugador.posicion}
                </Text>
                <Text className="text-xl text-white my-1">
                  <Text className="font-bold text-cyan-400">Club:</Text> {jugador.club}
                </Text>
                <Text className="text-xl text-white my-1">
                  <Text className="font-bold text-cyan-400">Nacionalidad:</Text> {jugador.nacionalidad}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;