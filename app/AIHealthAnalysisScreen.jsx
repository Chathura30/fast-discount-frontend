import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = "http://172.20.10.7:5000/api/ai/analyze"; 
const SERVER_URL = "http://172.20.10.7:5000";

export default function AIHealthAnalysisScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchHealthAnalysis();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchHealthAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/${id}`, { method: "GET" });
      const data = await res.json();
      
      console.log("AI Analysis Data:", data);

      if (data.success) {
        setAnalysis(data);
      } else {
        setError(data.message || "Failed to analyze product");
        setAnalysis(null);
      }
    } catch (err) {
      console.log("AI Fetch Error:", err);
      setError("Network error. Please check your connection.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A3D62" />
        <Text style={styles.loadingText}>🤖 AI is analyzing product health...</Text>
        <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
      </View>
    );
  }

  // Error state
  if (error || !analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Health Analysis</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={80} color="#999" />
          <Text style={styles.errorText}>{error || "No analysis available"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHealthAnalysis}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const product = analysis.product || {};
  const healthScore = analysis.health_score ?? 0;
  const aiText = analysis.ai_analysis || "No detailed analysis available.";

  // Parse AI response
  const analysisMatch = aiText.match(/Analysis:\s*(.+)/is);
  const analysisContent = analysisMatch ? analysisMatch[1].trim() : aiText;

  // Determine health category
  let scoreColor = '#d32f2f'; // Red
  let scoreLabel = 'Poor';
  let scoreIcon = 'close-circle';
  
  if (healthScore >= 75) {
    scoreColor = '#2e7d32'; // Green
    scoreLabel = 'Excellent';
    scoreIcon = 'checkmark-circle';
  } else if (healthScore >= 50) {
    scoreColor = '#f57c00'; // Orange
    scoreLabel = 'Moderate';
    scoreIcon = 'warning';
  }

  // Product image
  let productImage = 'https://via.placeholder.com/150';
  if (product.image) {
    if (product.image.startsWith('http')) {
      productImage = product.image;
    } else if (product.image.startsWith('/')) {
      productImage = `${SERVER_URL}${product.image}`;
    } else {
      productImage = `${SERVER_URL}/${product.image}`;
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Health Analysis</Text>
        <TouchableOpacity onPress={fetchHealthAnalysis}>
          <Ionicons name="refresh" size={24} color="#0A3D62" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Info Card */}
        <View style={styles.productCard}>
          <Image 
            source={{ uri: productImage }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name || "Product Name"}
            </Text>
            {product.description && (
              <Text style={styles.productDesc} numberOfLines={2}>
                {product.description}
              </Text>
            )}
            {product.expire_date && (
              <View style={styles.expiryRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.expiryText}>
                  Expires: {new Date(product.expire_date).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Health Score Card */}
        <View style={[styles.scoreCard, { borderColor: scoreColor }]}>
          <View style={styles.scoreHeader}>
            <Ionicons name={scoreIcon} size={32} color={scoreColor} />
            <Text style={styles.scoreTitle}>Health Score</Text>
          </View>
          
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>
              {healthScore}
            </Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
            <Text style={styles.scoreBadgeText}>{scoreLabel}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${healthScore}%`, backgroundColor: scoreColor }]} />
          </View>
        </View>

        {/* AI Analysis Card */}
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Ionicons name="analytics" size={24} color="#0A3D62" />
            <Text style={styles.analysisTitle}>AI Detailed Analysis</Text>
          </View>
          
          <Text style={styles.analysisText}>{analysisContent}</Text>
        </View>

        {/* Ingredients Card (if available) */}
        {product.ingredients && (
          <View style={styles.ingredientsCard}>
            <View style={styles.ingredientsHeader}>
              <Ionicons name="nutrition" size={24} color="#4CAF50" />
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
            </View>
            <Text style={styles.ingredientsText}>{product.ingredients}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={20} color="#999" />
          <Text style={styles.disclaimerText}>
            This analysis is AI-generated and for informational purposes only. 
            Consult a healthcare professional for medical advice.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
  },
  
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },

  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },

  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#0A3D62",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },

  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },

  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },

  productDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  expiryText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },

  scoreCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  scoreTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#333",
  },

  scoreCircle: {
    alignItems: "center",
    marginBottom: 16,
  },

  scoreNumber: {
    fontSize: 60,
    fontWeight: "700",
  },

  scoreMax: {
    fontSize: 20,
    color: "#999",
    marginTop: -10,
  },

  scoreBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },

  scoreBadgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  analysisCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  analysisTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
    color: "#333",
  },

  analysisText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
    textAlign: "justify",
  },

  ingredientsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  ingredientsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  ingredientsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
    color: "#333",
  },

  ingredientsText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },

  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff9e6",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe066",
  },

  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    marginLeft: 10,
    lineHeight: 20,
  },
});
