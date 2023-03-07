import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/dist/Fontisto";

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
        if (s) {
            setToDos(JSON.parse(s));
        }
    }
    
    //Todo 추가
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
    
    //Todo 삭제
    const deleteToDo = async(key) => {
        if (Platform.OS === "web") {
            const ok = confirm("Do you want to delete this To Do?");
            if (ok) {
                const newToDos = {...toDos}
                delete newToDos[key];
                setToDos(newToDos);
                saveToDos(newToDos);
            }
        } else {
            Alert.alert("Delete To Do?", "Are you sure?", [
                {text : "Cancel"},
                {text : "I'm Sure", onPress:()=> {
                    //ES6 문법을 활용해 object.assign과 똑같은 효과 내기
                    const newToDos = {...toDos}
                    delete newToDos[key];
                    setToDos(newToDos);
                    saveToDos(newToDos);
                }},
            ]);
        }
    }
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{fontSize : 38, fontWeight : "600",
                        color: working ? "white" : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{fontSize : 38, fontWeight : "600",
                    color: !working ? "white" : theme.grey}}>Travel</Text>                    
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    onSubmitEditing={addToDo}
                    onChangeText={onChangeText}
                    value={text}
                    returnKeyType="default"
                    placeholder={working ? "Add a To Do" : "Where do you want to go?"}
                    style={styles.input}/>
                <ScrollView>{
                    Object.keys(toDos).map((key=> (
                        toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            <Text style={styles.toDoText}>{toDos[key].text}</Text>
                            <TouchableOpacity onPress={()=>deleteToDo(key)}>
                                <Icon name="trash" size={20} color={theme.toDoBg}/>
                            </TouchableOpacity>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      toDoText : {
        color : "white",
        fontSize: 16,
        fontWeight: "500",
      }
});