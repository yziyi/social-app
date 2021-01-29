import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,TextInput,Button} from "react-native";
import { Keyboard } from 'react-native';


export default class NotificationScreen extends React.Component {
    
    state={
        liked:false,
        text:""
    }

    likeToggoled = ()=>{
        this.setState({
            liked:!this.state.liked
        })
        
    }
    
    render() {
        return (
          <View style={styles.container}>
            <TextInput
              style={{ height: 0, width: 0, borderWidth: 0 }}
              onChangeText={text => this.setState({ text })}
              ref={ref => {
                this.textInput = ref;
              }}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
            />
            <TouchableOpacity onPress={() => {
                this.textInput.focus();
              }}>
                <Text>press me</Text>
            </TouchableOpacity>
            
             
            </View>
         
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
});
