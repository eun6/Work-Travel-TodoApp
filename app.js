import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    useEffect(()=> {
        loadToDos();
    }, []);

    const travel =()=> setWorking(false);
    const work =()=> setWorking(true);
    const onChangeText =(payload)=> setText(payload);

    //local storage 역할, string으로 바꿔서 저장하기
    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };
    //작성된 toDo 있다면 object로 바꿔서 불러오기
    const loadToDos = async()=> {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(s));
    }
    

    const addToDo = async()=> {
        if (text === "") {
            return;
        }
        const newToDos = Object.assign({}, toDos, 
            //Object.assign(목표, 대상객체, {키})
            { [Date.now()] : { text, working},
        });
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    }
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    onSubmitEditing={addToDo}
                    onChangeText={onChangeText}
                    value={text}
                    returnKeyType="done"
                    placeholder={working ? "Add a To Do" : "Where do you want to go?"}
                    style={styles.input}/>
                <ScrollView>{
                    Object.keys(toDos).map((key=> (
                        toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            <Text style={styles.toDoText}>{toDos[key].text}</Text>
                        </View>) : null
                        )))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor : theme.bg,
        paddingHorizontal: 20,
    },
    header : {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText : {
        fontSize : 38,
        fontWeight : "600"
    },
    input : {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        fontSize: 18,
        marginBottom: 20,
      },
      toDo : {
        backgroundColor : theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
      },
      toDoText : {
        color : "white",
        fontSize: 16,
        fontWeight: "500",
      }
});