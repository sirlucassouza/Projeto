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
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja remover este processo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => {
            const novosProcessos = processos.filter((processo) => processo.id !== id);
            setProcessos(novosProcessos);
            salvarProcessos(novosProcessos);
          },
        },
      ]
    );
  };

  const processosFiltrados = processos.filter((processo) =>
    processo.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        Armazenamento de Processos Licitatórios da Prefeitura Municipal de Saubara
      </Text>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#fff" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar processo"
          placeholderTextColor="#ddd"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do processo"
          placeholderTextColor="#ddd"
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
          <View style={styles.processCard}>
            <Text style={styles.processText}>{item.titulo}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => removerProcesso(item.id)}>
                <Icon name="delete" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum processo encontrado</Text>
        }
      />

      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          Setor de Licitação - Prefeitura Municipal de Saubara
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contato:</Text>
          <Text style={styles.contactText}>(71) 93300-7574</Text>
          <Text style={styles.contactTitle}>Horário de Funcionamento:</Text>
          <Text style={styles.contactText}>
            Seg, Ter, Qua, Qui, Sex{'\n'}08:00 às 12:00 - 14:00 às 17:00
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3f51b5',
    backgroundColor: '#e8eaf6',
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  processCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  processText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  footerContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footer: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    flex: 1,
  },
  contactInfo: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  contactTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  contactText: {
    color: '#555',
  },
});

export default App;
