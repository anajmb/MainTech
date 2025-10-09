import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import type { ChartConfiguration } from 'chart.js';

interface ChartWebViewProps {
  config: ChartConfiguration;
}

const ChartWebView: React.FC<ChartWebViewProps> = ({ config }) => {
  const configString = JSON.stringify(config);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0"></script>

        <style>
          body, html, #chartContainer { margin: 0; padding: 0; width: 100%; height: 100%; }
          canvas { width: 100% !important; height: 100% !important; }
        </style>
      </head>
      <body>
        <div id="chartContainer">
          <canvas id="myChart"></canvas>
        </div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            // O plugin é registrado automaticamente ao ser importado
            const ctx = document.getElementById('myChart').getContext('2d');
            const chartConfig = ${configString};
            new Chart(ctx, chartConfig);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: {
      flex: 1,
      backgroundColor: 'transparent',
    },
});

export default ChartWebView;