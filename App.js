import React from "react";

import { createAppContainer, createSwitchNavigator} from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import PostScreen from "./screens/PostScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import GroupScreen from "./screens/GroupScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import ForumScreen from "./screens/ForumScreen";

const MessageStack = createStackNavigator(
    {
    Group: GroupScreen,
    Message: MessageScreen,
    },
);

const PostStack = createStackNavigator(
    {
        Forum: ForumScreen,
        PostDetail:{ 
            screen: PostDetailScreen,
            navigationOptions: {
                tabBarLabel: "Two",
                headerShown: false
            }, 
        }
    },
);

const TopTab = createMaterialTopTabNavigator (
    {
        A: {
            screen: PostStack,
            navigationOptions: {
                tabBarLabel: "Topic One"
            },
        },
        B: {
            screen: NotificationScreen,
            navigationOptions: {
                tabBarLabel: "Topic Two"
              },
        },
        
        
    },{
        tabBarOptions: {
            activeTintColor: "#161F3D",
            inactiveTintColor: "#B8BBC4",
            tabStyle:{
                backgroundColor:'white',
                height:85,
                
            },
            labelStyle: {
                paddingTop: 40,
            },
            style: {
                backgroundColor: 'white',
            },
        },
        
    }, 
)

const AppContainer = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Home: {
                    screen: HomeScreen,
                    
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />,
                        
                    }
                },
                Group: {
                    screen: MessageStack,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-chatboxes" size={24} color={tintColor} />
                    }
                },
                Post: {
                    screen: PostScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Ionicons
                                name="ios-add-circle"
                                size={48}
                                color="#E9446A"
                                style={{
                                    shadowColor: "#E9446A",
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowRadius: 10,
                                    shadowOpacity: 0.3
                                }}
                            />
                        )
                    }
                },
                Notification: {
                    screen: TopTab,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-notifications" size={24} color={tintColor} />
                    }
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
                    }
                }
            },
            {
                defaultNavigationOptions: {
                    tabBarOnPress: ({ navigation, defaultHandler }) => {
                        
                        if (navigation.state.key === "Post") {
                            navigation.navigate("postModal");
                        } else {
                            defaultHandler();
                        }  
                    }
                    
                },
                tabBarOptions: {
                    activeTintColor: "#161F3D",
                    inactiveTintColor: "#B8BBC4",
                    showLabel: false,
                    
                },
                
                
            }
        ),
        postModal: {
            screen: PostScreen
        },
        
    },
    {
        mode: "modal",
        headerMode:"none",
        
        // initialRouteName: "postModal"
    }
);

const AuthStack = createStackNavigator({
    
    Login: LoginScreen,
    Register: RegisterScreen
});



export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            App: AppContainer,
            Auth: AuthStack,
          
        },
        {
            initialRouteName: "Loading"
        }
    )
);


