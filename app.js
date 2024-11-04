import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [processos, setProcessos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [busca, setBusca] = useState('');

  // Carrega os processos ao iniciar o app
  useEffect(() => {
    carregarProcessos();
  }, []);

  // Função para carregar processos do AsyncStorage
  const carregarProcessos = async () => {
    try {
      const processosSalvos = await AsyncStorage.getItem('@processos');
      if (processosSalvos !== null) {
        setProcessos(JSON.parse(processosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  // Função para salvar processos no AsyncStorage
  const salvarProcessos = async (novosProcessos) => {
    try {
      await AsyncStorage.setItem('@processos', JSON.stringify(novosProcessos));
    } catch (error) {
      console.error('Erro ao salvar processos:', error);
    }
  };

  // Função para adicionar um novo processo
  const adicionarProcesso = () => {
    if (titulo.trim()) {
      const novoProcesso = {
        id: processos.length + 1,
        titulo: titulo.trim(),
      };
      const novosProcessos = [...processos, novoProcesso];
      setProcessos(novosProcessos);
      salvarProcessos(novosProcessos);
      setTitulo('');
    } else {
      Alert.alert('Erro', 'O nome do processo não pode estar vazio.');
    }
  };

  // Filtrar processos com base na busca
  const processosFiltrados = processos.filter((processo) =>
    processo.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Gestão de Processos Digitais</Text>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar processo"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Campo para adicionar novo processo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do processo"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TouchableOpacity style={styles.addButton} onPress={adicionarProcesso}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de processos */}
      <FlatList
        data={processosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.processItem}>
            <Text style={styles.processText}>{`${item.id}. ${item.titulo}`}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum processo encontrado</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  processItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  processText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default App;
