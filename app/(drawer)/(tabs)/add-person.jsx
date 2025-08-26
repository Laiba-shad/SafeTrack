import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../Server/context/AuthContext";
import API from "../../../constants/api";

export default function AddPersonScreen() {
  const { appState } = useAuth();
  const [joinCode, setJoinCode] = useState("");
  const [circleName, setCircleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchCircleInfo();
  }, []);

  const fetchCircleInfo = async () => {
    try {
      setFetching(true);
      const res = await API.get("/circle/info");
      
      if (res.data.circle) {
        setCircleName(res.data.circle.name);
        setIsAdmin(res.data.isAdmin);
        
        if (res.data.isAdmin) {
          try {
            const codeRes = await API.get(`/circle/${res.data.circle._id}/join-code`);
            setJoinCode(codeRes.data.code || "");
          } catch (error) {
            console.error("Error fetching join code:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching circle info:", error);
      Alert.alert("Error", "Failed to fetch circle information");
    } finally {
      setFetching(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!appState.user.circleId) {
      Alert.alert("Error", "You are not part of any circle");
      return;
    }

    if (!isAdmin) {
      Alert.alert("Access Denied", "Only circle admins can generate join codes");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/circle/generate-join-code", {
        circleId: appState.user.circleId
      });
      
      setJoinCode(res.data.code);
      Alert.alert("Success", "New join code generated successfully");
    } catch (error) {
      console.error("Error generating join code:", error);
      if (error.response?.status === 403) {
        Alert.alert("Access Denied", "You don't have permission to generate join codes");
      } else {
        Alert.alert("Error", "Failed to generate join code");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShareCode = async () => {
    if (!joinCode) {
      Alert.alert("Error", "No join code available");
      return;
    }

    try {
      await Share.share({
        message: `Join my circle "${circleName}" using this join code: ${joinCode}`,
        title: "Join Circle"
      });
    } catch (error) {
      console.error("Error sharing code:", error);
    }
  };

  if (fetching) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  if (!appState.user.circleId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add Person</Text>
        <Text style={styles.message}>You are not part of any circle</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Your Beloved One❤</Text>
      <Text style={styles.circleName}>{circleName}</Text>
      
      <View style={styles.roleContainer}>
        <Text style={styles.roleText}>
          Role: {isAdmin ? "Admin" : "Member"}
        </Text>
      </View>
      
      {isAdmin ? (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Join Code:</Text>
          <Text style={styles.code}>
            {joinCode || "No active code"}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.generateButton, loading && { backgroundColor: "#ccc" }]} 
              onPress={handleGenerateCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Generate Code</Text>
              )}
            </TouchableOpacity>
            
            {joinCode && (
              <TouchableOpacity 
                style={[styles.button, styles.shareButton]} 
                onPress={handleShareCode}
              >
                <Text style={styles.buttonText}>Share Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.memberContainer}>
          <Text style={styles.memberText}>
            Only circle admins can generate join codes. Contact your circle admin to get a join code.
          </Text>
        </View>
      )}
      
      <Text style={styles.infoText}>
        {isAdmin 
          ? "Share this code with people you want to add to your circle. They can use it during registration."
          : "Contact your circle admin to get a join code for new members."
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008080",
  },
  circleName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  roleContainer: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  roleText: {
    fontSize: 14,
    color: "#008080",
    fontWeight: "bold",
  },
  codeContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  code: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff7f50",
    letterSpacing: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
  },
  generateButton: {
    backgroundColor: "#ff7f50",
  },
  shareButton: {
    backgroundColor: "#008080",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  memberContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  memberText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  }
});