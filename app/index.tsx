import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text, FlatList, TextInput, Pressable, Appearance } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import Animated, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = ([
            { id: 1, name: "Set up the new computer", completed: false },
            { id: 2, name: "Research for the article", completed: false },
            { id: 3, name: "Pay the bills", completed: false },
            { id: 4, name: "Take care of car", completed: false },
            { id: 5, name: "Finish presentation", completed: false },
            { id: 6, name: "Cook dinner", completed: false },
            { id: 7, name: "Visit the doctor", completed: false },
            { id: 8, name: "Attend the meeting", completed: false },])

export default function HomeScreen() {

  type Item = {
    id: number,
    name: string,
    completed: boolean,
  }
  const [toDoList, setTodo] = useState<Item[]>([]);

  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp") //????
        const toDoStorage = jsonValue != null ? JSON.parse(jsonValue) : null

        if (toDoStorage && toDoStorage.length) {
          setTodo(toDoStorage)
        }
        else {
          setTodo(data)
        }

      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
    console.log("data has been FETCHED")
  }, [])

  useEffect(() => {
    const storeToDo = async () => {
      try {
        const jsonValue = JSON.stringify(toDoList)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }
    storeToDo()
    console.log("data has been STORED")
  }, [toDoList])

  const addItem = () => {
    if (newName != "") {
      let newId: number = (toDoList.length > 0 ? toDoList[toDoList.length - 1].id + 1 : 1);
      const newItem: Item = { id: newId, name: newName, completed: false }
      setTodo([...toDoList, newItem])
      setNewName('');
    }
  }
  const crossOffItem = (clickedId: number) => {
    setTodo(toDoList.map(item => item.id === clickedId ? { ...item, completed: !item.completed } : item));
  }

  const deleteItem = (clickedId: number) => {
    const filteredList = toDoList.filter(item => item.id !== clickedId);
    setTodo(filteredList);
  }

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.listItem}>
      <Text style={[styles.text, item.completed && styles.completed]} onPress={() => crossOffItem(item.id)}> {item.name}</Text>
      <Pressable style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
        <Text>X</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topBar}>
        <TextInput style={styles.inputBox} placeholder='add new item...' placeholderTextColor={'grey'} value={newName} onChangeText={setNewName}></TextInput>
        <Pressable style={styles.inputButton} onPress={addItem}>
          <Text>Add</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Animated.FlatList
          data={toDoList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  topBar: {
    padding: 0,
    flexDirection: 'row',
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    fontSize: 20,
    color: '#FFF',
    borderColor: '#333',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    margin: 8,
  },
  inputButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flex: 1,
    margin: 8,
  },

  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteButton: {
    width: 50,
    height: 30,
    backgroundColor: 'red',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
