import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BASE_URL = "http://172.20.10.7:5000/api/orders";

export default function SalesDashboardScreen() {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/admin/sales-report`);
      console.log("Sales Report:", res.data);
      setReport(res.data);
    } catch (error) {
      console.log("Error fetching report:", error);
      setError("Failed to load sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C1A18" />
        <Text style={styles.loadingText}>Loading Sales Report...</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={60} color="#999" />
        <Text style={styles.errorText}>{error || "No data available"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReport}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width - 20;

  // Safe data extraction with defaults
  const summary = report.summary || { total_sales: 0, total_orders: 0, total_items: 0 };
  const dailySales = report.daily_sales || [];
  const monthlySales = report.monthly_sales || [];
  const bestProducts = report.best_selling_products || [];

  // Prepare chart data with safe fallbacks
  const dailyChartData = dailySales.length > 0
    ? {
        labels: dailySales.slice(-7).map((d) => {
          const date = new Date(d.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [{ 
          data: dailySales.slice(-7).map((d) => Number(d.daily_sales) || 0),
        }],
      }
    : {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };

  const monthlyChartData = monthlySales.length > 0
    ? {
        labels: monthlySales.slice(-6).map((m) => {
          const [year, month] = m.month.split('-');
          return `${month}/${year.slice(-2)}`;
        }),
        datasets: [{ 
          data: monthlySales.slice(-6).map((m) => Number(m.monthly_sales) || 0),
        }],
      }
    : {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Expo Router Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#5C1A18" />
        </TouchableOpacity>
        <Text style={styles.header}>Sales Dashboard</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={28} color="#5C1A18" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Total Sales</Text>
          <Text style={styles.cardValue}>
            LKR {Number(summary.total_sales || 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="receipt-outline" size={28} color="#5C1A18" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Total Orders</Text>
          <Text style={styles.cardValue}>{summary.total_orders || 0}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Ionicons name="cube-outline" size={28} color="#5C1A18" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Items Sold</Text>
          <Text style={styles.cardValue}>{summary.total_items || 0}</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="trending-up-outline" size={28} color="#28a745" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Avg Order Value</Text>
          <Text style={styles.cardValue}>
            LKR {summary.total_orders > 0 
              ? (summary.total_sales / summary.total_orders).toFixed(2)
              : '0.00'}
          </Text>
        </View>
      </View>

      {/* Daily Sales Chart */}
      {dailySales.length > 0 ? (
        <>
          <Text style={styles.chartTitle}>Daily Sales (Last 7 Days)</Text>
          <LineChart
            data={dailyChartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel="LKR "
            yAxisSuffix=""
          />
        </>
      ) : (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataText}>No daily sales data available</Text>
        </View>
      )}

      {/* Monthly Sales Chart */}
      {monthlySales.length > 0 ? (
        <>
          <Text style={styles.chartTitle}>Monthly Sales (Last 6 Months)</Text>
          <BarChart
            data={monthlyChartData}
            width={screenWidth}
            height={240}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel="LKR "
            yAxisSuffix=""
            showValuesOnTopOfBars
          />
        </>
      ) : (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataText}>No monthly sales data available</Text>
        </View>
      )}

      {/* Best Selling Products */}
      <Text style={styles.chartTitle}>
        Best Selling Products
        {bestProducts.length > 0 && (
          <Text style={styles.chartSubtitle}> ({bestProducts.length} products)</Text>
        )}
      </Text>
      {bestProducts.length > 0 ? (
        bestProducts.slice(0, 10).map((item, index) => (
          <View key={index} style={styles.bestItem}>
            <View style={styles.bestRank}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.bestInfo}>
              <Text style={styles.bestName}>{item.product_name}</Text>
              <Text style={styles.bestCount}>{item.total_sold} units sold</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataText}>No product sales data</Text>
        </View>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#f8f8f8",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(92, 26, 24, ${opacity})`,
  labelColor: () => "#555",
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#5C1A18" },
  propsForBackgroundLines: {
    strokeDasharray: "", // solid lines
    stroke: "#e3e3e3",
  },
  barPercentage: 0.6,
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#FAFAFA", paddingBottom: 30 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#5C1A18",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  header: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#5C1A18",
    marginRight: 28,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: { fontSize: 13, color: "#888", marginBottom: 4 },
  cardValue: { fontSize: 20, fontWeight: "700", color: "#333" },

  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: "#333",
  },
  chartSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#888",
  },
  chart: {
    borderRadius: 16,
    marginBottom: 10,
  },

  noDataBox: {
    backgroundColor: "#f9f9f9",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  noDataText: {
    fontSize: 15,
    color: "#999",
  },

  bestItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  bestRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5C1A18",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  bestInfo: {
    flex: 1,
  },
  bestName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  bestCount: { fontSize: 14, color: "#5C1A18", fontWeight: "500" },
});
