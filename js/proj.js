
var dom = document.getElementById('proj-container');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

const colors = ['#4b5cc4',  '#065279', '#177cb0', '#1685a9'];
const bgColor = '#FFFFFF';
const itemStyle = {
star5: {
color: colors[0]
},
star4: {
color: colors[1]
},
star3: {
color: colors[2]
},
star2: {
color: colors[3]
}
};
const data = [
{
name: '白泽智能',
nodeClick:false,
itemStyle: {
  color: '#FFFFFF'
},
children: [
  {
    name: '模型供应链',
    nodeClick:'link',
    link: "./projects.html#ai-supply-chain",
    children: [
      {
        class: '5☆',
        // name:"时间序列: 传感器数据, 气象、金融",
        children: [
          {
            name: '对抗样本',
            nodeClick:false
          },
          {
            name: '后门攻防',
            nodeClick:false
          },
          {
            name: '分布式攻防',
            nodeClick:false
          },
          {
            name: '鲁棒性与泛化性',
            nodeClick:false
          }
        ]
      }
    ]
  },
  {
    name: '数据隐私',
    nodeClick:'link',
    link: "./projects.html#data-protection",
    children: [
      {
        class: '4☆',
        children: [
          {
            name: '属性推理',
            nodeClick:false
          },
          {
            name: '成员推理',
            nodeClick:false
          },
          {
            name: '数据重建',
            nodeClick:false
          },
          {
            name: '模型反演',
            nodeClick:false
          }
        ]
      }]
  },
  {
    name: '模型产权',
    nodeClick:'link',
    // link: "./projects.html",
    children: [
      {
        class: '3☆',
        children: [
          {
            name: '模型水印',
            nodeClick:false
          },
          {
            name: '模型指纹',
            nodeClick:false
          },
          {
            name: '模型窃取',
            nodeClick:false
          },
          {
            name: '模型溯源',
            nodeClick:false
          }
        ]
      }]
  },
  {
    name: '大模型安全',
    nodeClick:'link',
    link: "./index.html#llm-security",
    children: [
      {
        class: '2☆',
        children: [
          {
            name: '文本大模型安全',
            nodeClick:false
          },
          {
            name: '多模态大模型安全',
            nodeClick:false
          },
          {
            name: '文生图大模型安全',
            nodeClick:false
          },
          {
            name: 'Agent安全',
            nodeClick:false
          }
        ]
      }
    ]
  }
]
}
];
for (let j = 0; j < data.length; ++j) {
let level1 = data[j].children;
for (let i = 0; i < level1.length; ++i) {
let block = level1[i].children;
let bookScore = [];
let bookScoreId;
for (let star = 0; star < block.length; ++star) {
  let style = (function (name) {
    switch (name) {
      case '5☆':
        bookScoreId = 0;
        return itemStyle.star5;
      case '4☆':
        bookScoreId = 1;
        return itemStyle.star4;
      case '3☆':
        bookScoreId = 2;
        return itemStyle.star3;
      case '2☆':
        bookScoreId = 3;
        return itemStyle.star2;
    }
  })(block[star].class);
  block[star].label = {
    color: style.color,
    downplay: {
      opacity: 0.5
    }
  };
  if (block[star].children) {
    style = {
      opacity: 1,
      color: style.color
    };
    block[star].children.forEach(function (book) {
      book.value = 1;
      book.itemStyle = style;
      book.label = {
        color: style.color
      };
      let value = 1;
      if (bookScoreId === 0 || bookScoreId === 3) {
        value = 5;
      }
      if (bookScore[bookScoreId]) {
        bookScore[bookScoreId].value += value;
      } else {
        bookScore[bookScoreId] = {
          color: colors[bookScoreId],
          value: value
        };
      }
    });
  }
}
level1[i].itemStyle = {
  color: colors[i]
};
}
}
option = {
backgroundColor: bgColor,
color: colors,
series: [
{
  type: 'sunburst',
  center: ['50%', '48%'],
  data: data,
  sort: function (a, b) {
    if (a.depth === 1) {
      return b.getValue() - a.getValue();
    } else {
      return a.dataIndex - b.dataIndex;
    }
  },
  label: {
    rotate: 'radial',
    color: bgColor
  },
  itemStyle: {
    borderColor: bgColor,
    borderWidth: 2
  },
  levels: [
    {},
    {
      r0: 0,
      r: 80,
      label: {
        rotate: 0,
        fontSize:30,
        color:"	#254084"
      }
    },
    {
      r0: 80,
      r: 240,
      label: {
        rotate: 0,
        fontSize:30
      }
      
    },
    {
      r0: 280,
      r: 300,
      itemStyle: {
        shadowBlur: 2,
        shadowColor: colors[2],
        color: 'transparent'
      },
      label: {
        rotate: 'tangential',
        fontSize: 10,
        color: colors[0],
        opacity:0
      },
    },
    {
      r0: 300,
      r: 340,
      itemStyle: {
        shadowBlur: 80,
        shadowColor: "#FFFFFF"
      },
      label: {
        position: "outside",
        textShadowBlur: 0,
        textShadowColor: '#FFFFFF',
        fontSize:20,
        rotate:0,
        distance:20
      },
      downplay: {
        label: {
          opacity: 0.5
        }
      }
    }
  ]
}
]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

// myChart.on("click", function(params) {
//     if(params.name == "AI供应链\n安全" || params.name == "模型保护\n与数据隐私" || params.name == "模型测试\n与优化" || params.name == "AI赋能安全"){
//         window.location.href = params.data.url
//     }
// })
window.addEventListener('resize', myChart.resize);
