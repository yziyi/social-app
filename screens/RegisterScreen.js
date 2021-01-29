
// Loading.js
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TextInput, TouchableOpacity,Image, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import Fire from "../Fire";

export default class RegisterScreen extends React.Component {
  static navigationOptions={
    header:null
  };

  state={
    name:"",
    email:"",
    password:"",
    errorMessage:null
  }

  
  addName = () =>{
    Fire.shared.firestore
    .collection('posts')
    .doc(this.state.name)
    .set({
        name:this.state.name
    })
  

  }
  handleSignUp =()=>{
    this.addName()
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredentials =>{
        return userCredentials.user.updateProfile({
          displayName:this.state.name
        });
      })
      .catch(error => this.setState({errorMessage:error.message}))
  }
  

  render() {
      return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>

        <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={24} color={"black"}></Ionicons>
        </TouchableOpacity>



        <View style={{postion:"absolute", top:70, alignItems:"center",width:"100%"}}>
          <Text style={styles.greeting}>{'Hello!\nSign up to get started.'}</Text>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="ios-add" size={40} color="#FFF" style={{marginTop:6, marginLeft:2}}></Ionicons>
          </TouchableOpacity>
        </View>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTile}>Full name</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              onChangeText={name =>this.setState({name})}
              value={this.state.name}
            ></TextInput>
          </View>


          <View style={{marginTop:32}}>
            <Text style={styles.inputTile}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              onChangeText={email =>this.setState({email})}
              value={this.state.email}
            ></TextInput>
          </View>

          <View style={{marginTop:32}}>
            <Text style={styles.inputTile}>Password</Text>
            <TextInput 
                style={styles.input} 
                secureTextEntry 
                autoCapitalize="none"
                onChangeText={password =>{this.setState({password})}}
                value={this.state.password}
            ></TextInput>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{color:"#FFF", fontWeight:"500"}}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{alignSelf:"center", marginTop:32}}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{color:"#414959", fontSize:13}}>New to SocialApp?
          <Text style={{color:"#E9446A", fontWeight:"500"}}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  error:{
    color:"#E9446A",
    fontSize:13,
    fontWeight:"600",
    textAlign:"center"
  },
  greeting:{
    marginTop:15,
    fontSize:18,
    fontWeight:"400",
    textAlign:"center",
  },
  errorMessage:{
    height:72,
    alignItems:"center",
    justifyContent:"center",
    marginHorizontal: 30
  },
  form:{
    marginTop:30,
    marginBottom:48,
    marginHorizontal:30,
  },
  inputTile:{
    color:"#8A8F9E",
    fontSize:10,
    textTransform:"uppercase"
  },
  input:{
    borderBottomColor:"#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height:35,
    fontSize:15,
    color:"#161F3D"
  },
  button:{
    marginHorizontal:30,
    backgroundColor:"#E9446A",
    borderRadius:4,
    height:52,
    alignItems:"center",
    justifyContent:"center"
  },
  back:{
    position:"absolute",
    top:48,
    left:32,
    width:32,
    height:32,
    backgroundColor: "white",
    alignItems:"center",
    justifyContent:"center"

  },
  avatar:{
    width:100,
    height:100,
    borderRadius:50,
    backgroundColor:"#E1E2E6",
    marginTop:30,
    justifyContent:"center",
    alignItems:"center"
  }
})


