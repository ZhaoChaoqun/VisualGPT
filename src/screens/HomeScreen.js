import { Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, { Component, useEffect, useState } from 'react'
import Features from '../components/features'
import { dummyMessages } from '../constrants';
import Voice from '@react-native-community/voice';

export default function HomeScreen() {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(true);

  const clear = () => {
    setMessages([]);
  }
  const stopSpeaking = () => {
    setSpeaking(false);
  }

  useEffect(() => {
    // voice hanlder events
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }, [])

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/welcome.png')} style={{height: hp(15), width: hp(15)}} />
        </View>
        {/* features || messages */}
        {
          messages.length > 0 ? (
            <View className="space-y-2 flex-1">
              <Text className='text-gray-700 font-semibold ml-1'>
                Assistant
              </Text>
              <View style={{height: hp(58)}} className="bg-neutral-200 rounded-3xl p-4">
                <ScrollView 
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
            recording? (
              <TouchableOpacity>
                <Image className="rounded-full"
                  source={require('../../assets/images/voiceLoading.gif')}
                  style={{width: hp(10), height: hp(10)}} />
              </TouchableOpacity>
            ): (
              <TouchableOpacity>
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