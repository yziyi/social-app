import React from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView, StyleSheet, View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Fire from "../Fire";
import firebase from "firebase";

export default class MessageScreen extends React.Component {
    static navigationOptions =({navigation})=>{
        return{
            title: navigation.getParam("groupName")
        }
    };

    state = {
        messages: []
    };

    get user() {
        return {
            _id: Fire.shared.uid,
            name: firebase.auth().currentUser.displayName
        };
    }

    off() {
        this.db.off();
    }

    get db() {
        return firebase.database().ref("messages").child(this.props.navigation.getParam("groupName"));
    }

    get = callback => {
        this.db.on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);

        return {
            _id,
            createdAt,
            text,
            user
        };
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };

            this.db.push(message);
        });
    };

    componentDidMount() {
        this.get(message =>
            this.setState(previous => ({
                messages: GiftedChat.append(previous.messages, message)
            }))
        );
    }

    componentWillUnmount() {
        this.off();
    }

    render() {
        const chat = <GiftedChat messages={this.state.messages} onSend={this.send} user={this.user} />;

        if (Platform.OS === "android") {
            return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30} enabled>
                    {chat}
                </KeyboardAvoidingView>
            );
        }

        return (
            <View style={styles.container}>
                 {chat} 
            </View>
            
            
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
})
