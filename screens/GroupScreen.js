import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,FlatList} from "react-native";

export default class NotificationScreen extends React.Component {
    static navigationOptions = {
        title: "Groups",
        
    };

    state={
        list:[
            {name:'group 1'},
            {name:'group 2'},
            {name:'group 3'},
        ]
    }

    renderPost = (group) => {
        return (
            <View style={styles.feedItem}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Message", {groupName:group.name})}}>
                    <Text style={styles.name}>{group.name}</Text>   
                </TouchableOpacity>
            </View>
        );     
    };

    render() {
        return (
            
            <View style={styles.container}>
                
                <FlatList
                    style={styles.feed}
                    data={this.state.list}
                    renderItem={({item}) => this.renderPost(item)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    box:{
        padding:20, 
    },
    name:{
        fontSize:15
    }
    
});
