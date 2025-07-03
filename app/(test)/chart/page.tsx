'use client';

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// Define the types for better type checking
type EChartsOption = echarts.EChartsOption;

interface RawDataItem extends Array<number | string> {
  0: string; // Date
  1: number; // Open
  2: number; // Close
  3: number; // Low
  4: number; // High
  5: number; // Volume
}

interface SplitData {
  categoryData: string[];
  values: number[][];
  volumes: [number, number, 1 | -1][];
}

const upColor = '#00da3c';
const downColor = '#ec0000';

function splitData(rawData: RawDataItem[]): SplitData {
  const categoryData: string[] = [];
  const values: number[][] = [];
  const volumes: [number, number, 1 | -1][] = [];

  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i][0] as string);
    // Values are [open, close, low, high]
    values.push([
      rawData[i][1] as number, // Open
      rawData[i][2] as number, // Close
      rawData[i][3] as number, // Low
      rawData[i][4] as number, // High
    ]);
    // Volumes are [index, volume, direction (1 for up, -1 for down)]
    // 시가(open)가 종가(close)보다 크면 음봉(하락), 작으면 양봉(상승)
    volumes.push([
      i,
      rawData[i][5] as number, // Volume
      (rawData[i][1] as number) > (rawData[i][2] as number) ? -1 : 1,
    ]);
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
  };
}

export default function StockChart() {
  const [option, setOption] = useState<EChartsOption | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // public 폴더의 데이터는 '/데이터경로'로 바로 접근합니다.
        const response = await fetch('/data/stock-DJI.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData: RawDataItem[] = await response.json();
        const data = splitData(rawData);

        const chartOption: EChartsOption = {
          animation: false,
          legend: {
            bottom: 10,
            left: 'center',
            data: ['Dow-Jones index'],
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000',
            },
            position: function (pos, params, el, elRect, size) {
              const obj: Record<string, number> = {
                top: 10,
              };
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
            },
          },
          axisPointer: {
            link: [
              {
                xAxisIndex: 'all',
              },
            ],
            label: {
              backgroundColor: '#777',
            },
          },
          // toolbox: {
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: false,
          //     },
          //     brush: {
          //       type: ["lineX", "clear"],
          //     },
          //   },
          // },
          // brush: {
          //   xAxisIndex: "all",
          //   brushLink: "all",
          //   outOfBrush: {
          //     colorAlpha: 0.1,
          //   },
          // },
          visualMap: {
            show: false,
            seriesIndex: 5, // Volume 시리즈 (배열의 6번째, 인덱스 5)
            dimension: 2, // volumes 배열의 세 번째 요소 (방향)
            pieces: [
              {
                value: 1, // 양봉일 경우
                color: upColor,
              },
              {
                value: -1, // 음봉일 경우
                color: downColor,
              },
            ],
          },
          grid: [
            {
              left: '10%',
              right: '8%',
              height: '50%',
            },
            {
              left: '10%',
              right: '8%',
              top: '63%',
              height: '16%',
            },
          ],
          xAxis: [
            {
              type: 'category',
              data: data.categoryData,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              min: 'dataMin',
              max: 'dataMax',
              axisPointer: {
                z: 100,
              },
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.categoryData,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              min: 'dataMin',
              max: 'dataMax',
            },
          ],
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: true,
              },
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 98,
              end: 100,
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '85%',
              start: 98,
              end: 100,
            },
          ],
          series: [
            {
              name: 'Dow-Jones index',
              type: 'candlestick',
              data: data.values,
              itemStyle: {
                color: upColor,
                color0: downColor,
                borderColor: undefined,
                borderColor0: undefined,
              },
            },
            {
              name: '구매량',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes,
            },
          ],
        };
        setOption(chartOption);
        setLoading(false);
      } catch (err) {
        console.error('주식 데이터를 불러오는데 실패했습니다:', err);
        setError('차트 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>차트 로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div style={{ width: '100%', height: '800px' }}>
      {option && (
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
}
