import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SettingButton = ({ title, icon, onPress, isActive }) => {
  return (
    <TouchableOpacity style={styles.settingButton} onPress={onPress}>
      <View style={styles.titleWraper}>
        <MaterialCommunityIcons name={icon} size={20} color={'#008080'} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <MaterialCommunityIcons
        name={isActive ? "check-circle" : "checkbox-blank-circle-outline"}
        size={20}
        color={isActive ? '#FFC107' : '#ff7f50'}
      />
    </TouchableOpacity>
  );
};

export default SettingButton;

const styles = StyleSheet.create({
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  titleWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  }
});














// chatgpt sy pucha phir yeh likha 
//  import { MaterialCommunityIcons } from "@expo/vector-icons";
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const SettingButton = ({ title, icon, onPress, isActive }) => {
//   return (
//     <TouchableOpacity style={styles.settingButton} onPress={onPress}>
//       <View style={styles.titleWraper}>
//         <MaterialCommunityIcons name={icon} size={20} color={'#008080'} />
//         <Text style={styles.title}>{title}</Text>
//       </View>
//       <MaterialCommunityIcons
//         name={isActive ? "check-circle" : "checkbox-blank-circle-outline"}
//         size={20}
//         color={isActive ? '#FFC107' : '#ff7f50'}
//       />
//     </TouchableOpacity>
//   );
// };

// export default SettingButton;

// const styles = StyleSheet.create({
//   settingButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffffff',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   titleWraper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });













// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// type SettingButtonProps = {
//     title: string;
//     icon: React.ComponentProps <typeof MaterialCommunityIcons>["name"];
//     onPress: () => void;
//     isActive?: boolean;
// }



// const SettingButton = ( {title, icon , onPress , isActive} : SettingButtonProps ) => {
//   return (
//     <TouchableOpacity style = {styles.settingButton    }  onPress={onPress }>
//         <View style = {styles.titleWraper}>
//          <MaterialCommunityIcons name= {"lightbulb-on"} size={20} color= {'#008080'} />

//          <Text style = {styles.title}>  {title} </Text>
//          </View>
//         <MaterialCommunityIcons name= {isActive? "check-circle" : "checkbox-blank-circle-outline"}   size={20}
//         // color = {isActive? '#008080' : '#ffffff'}
//         color = {isActive ? '#FFC107': '#ff7f50'}
//         />

//      </TouchableOpacity>
//   )
// }

// export default SettingButton

// const styles = StyleSheet.create({
//     settingButton:{
//         flexDirection : 'row',
//         justifyContent : 'space-between',
//         alignItems : 'center',
//         backgroundColor : '#ffffffff',
//         padding : 20,
//         borderRadius : 10,
//         marginBottom : 15,
//     },
//     titleWraper : {
//         flexDirection : 'row',
//         alignItems : 'center',
//         gap : 10,
//     },
//     title : {
//         fontSize : 14,
//         fontWeight : '500',

//     }

// })