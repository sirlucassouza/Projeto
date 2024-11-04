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
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [processos, setProcessos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarProcessos();
  }, []);

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

  const salvarProcessos = async (novosProcessos) => {
    try {
      await AsyncStorage.setItem('@processos', JSON.stringify(novosProcessos));
    } catch (error) {
      console.error('Erro ao salvar processos:', error);
    }
  };

  const adicionarProcesso = () => {
    if (titulo.trim()) {
      const novoProcesso = {
        id: uuidv4(),
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

  const removerProcesso = (id) => {
    const novosProcessos = processos.filter((processo) => processo.id !== id);
    setProcessos(novosProcessos);
    salvarProcessos(novosProcessos);
  };

  const processosFiltrados = processos.filter((processo) =>
    processo.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('./assets/logo.png')}
        resizeMode="contain"
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.header}>Armazenamento de Processos Licitatórios da Prefeitura Municipal de Saubara</Text>

          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="gray" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar processo"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

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

          <FlatList
            data={processosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.processItem}>
                <Text style={styles.processText}>{`${item.titulo}`}</Text>
                <TouchableOpacity onPress={() => removerProcesso(item.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum processo encontrado</Text>
            }
          />

          <Text style={styles.footer}>
            Setor de Licitação - Prefeitura Municipal de Saubara
          </Text>
          <Text style={styles.footerContact}>
            Contato: (71) 93300-7574
            {"\n"}Horário de Funcionamento:
            {"\n"}Seg, Ter, Qua, Qui, Sex - 08:00 às 12:00 e 14:00 às 17:00
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'darkgreen',
    textAlign: 'center',
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  footer: {
    fontSize: 16,
    color: 'darkgreen',
    textAlign: 'center',
    marginTop: 20,
  },
  footerContact: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
