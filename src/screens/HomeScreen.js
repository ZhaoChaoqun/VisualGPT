import { Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, { Component, useEffect, useReducer, useState, useRef } from 'react'
import Features from '../components/features'
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import apiCall from '../api/openAI';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const ScrollViewRef = useRef()
  
  const speechStartHandler = e => {
    console.log('Speech start handler')
  }
  const speechEndHandler = e => {
    setRecording(false);
    console.log('Speech end handler')
  }
  const speechResultsHandler = e => {
    console.log('voice event:', e)
    const text = e.value[0];
    setResult(text);
    stopRecording()
  }
  const speechErrorHandler = e => {
    console.log('Speech error handler', e)
  }
  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.log('error:', e)
    }
  }
  const stopRecording = async () => {
    try {
      // await Voice.stop();
      setRecording(false)
      fetchResponse()
      // fetch response
    } catch (e) {
      console.log('error:', e)
    }
  }
  const fetchResponse = () => {
    console.log('fetching response:', result)
    if (result.trim().length > 0) {
      console.log('fetchResponse:', result)
      let newMessages = [...messages]
      const message = {
        role: 'user',
        content: result.trim()
      }
      newMessages.push(message)
      setMessages([...newMessages])
      updateScrollView()
      setLoading(true)
      // api call
      apiCall(result.trim(), newMessages)
        .then(response => {
          setLoading(false)
          console.log('got api data:', response)
          if (response.success) {
            setMessages([...response.messages.content])
            updateScrollView()
            setResult('')
          } else {
            Alert.alert('Error', response.message)
          }
        })
        .catch(error => {
          console.log('error:', error)
          Alert.alert('Error', response.message)
        })
    }

  }

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scrollToEnd({animated: true})
    }, 200);
  }

  const clear = () => {
    setMessages([]);
  }
  const stopSpeaking = () => {
    setSpeaking(false);
  }
  
  useEffect(() => {
    // voice hanlder events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        {/* <View className="flex-row justify-center">
          <Image source={require('../../assets/images/welcome.png')} style={{height: hp(15), width: hp(15)}} />
        </View> */}
        {/* features || messages */}
        {
          messages.length > 0 ? (
            <View className="space-y-2 flex-1">
              <Text className='text-gray-700 font-semibold ml-1'>
                Assistant
              </Text>
              <View style={{height: hp(58)}} className="bg-neutral-200 rounded-3xl p-4">
                <ScrollView 
                  ref={ScrollViewRef}
                  bounces={false} 
                  className="space-y-4" 
                  showVerticalScrollIndicator={false}
                >
                {
                  messages.map((message, index) => {
                    if (message.role === 'assistant') {
                      if (message.content.includes('https')) {
                        return (
                          // its an image
                          <View key={index} className="flex-row justify-start">
                            <View className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                              <Image source={{uri: message.content}} className="rounded-2xl"
                                resizeMode='contain'
                                style={{width: wp(60), height: wp(60)}} />
                            </View>
                          </View>
                        )
                      } else {
                        // text response
                        return (
                          <View key={index} className="flex-row justify-start">
                            <View stype={{width: wp(70)}} className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                              <Text>{message.content}</Text>
                            </View>
                          </View>
                        )
                      }
                    } else {
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View stype={{width: wp(70)}} className="bg-white rounded-xl p-2 rounded-tr-none">
                          {/* <View stype={{width: wp(70)}} className="bg-white rounded-xl p-2"> */}
                            <Text>{message.content}</Text>
                          </View>
                        </View>
                      )
                    }
                  })
                }
                </ScrollView>
              </View>
            </View>
          ): (
            <Features />
          )
        }
        {/* recording, clear and stop buttons */}
        <View className="flex justify-center items-center">
          {
            loading? (
              <Image source={require('../../assets/images/loading.gif')}
                style={{width: hp(10), height: hp(10)}} />
            ): (
              recording? (
                <TouchableOpacity onPress={stopRecording}>
                  {/* recording stop button */}
                  <Image className="rounded-full"
                    source={require('../../assets/images/voiceLoading.gif')}
                    style={{width: hp(10), height: hp(10)}} />
                </TouchableOpacity>
              ): (
                <TouchableOpacity onPress={startRecording}>
                  {/* recording start button */}
                  <Image className="rounded-full"
                    source={require('../../assets/images/recordingIcon.png')}
                    style={{width: hp(10), height: hp(10)}} />
                </TouchableOpacity>
              )
            )
          }
          {
            recording? (
              <TouchableOpacity onPress={stopRecording}>
                {/* recording stop button */}
                <Image className="rounded-full"
                  source={require('../../assets/images/voiceLoading.gif')}
                  style={{width: hp(10), height: hp(10)}} />
              </TouchableOpacity>
            ): (
              <TouchableOpacity onPress={startRecording}>
                {/* recording start button */}
                <Image className="rounded-full"
                  source={require('../../assets/images/recordingIcon.png')}
                  style={{width: hp(10), height: hp(10)}} />
              </TouchableOpacity>
            )
          }
          {
            messages.length>0 && (
              <TouchableOpacity 
                onPress={clear}
                className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                <Text className="text-white font-semibold">Clear</Text>
              </TouchableOpacity>
            )
          }
          {
            speaking && (
              <TouchableOpacity 
                onPress={stopSpeaking}
                className="bg-red-400 rounded-3xl p-2 absolute left-10">
                <Text className="text-white font-semibold">Stop</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView>
    </View>
  )
}