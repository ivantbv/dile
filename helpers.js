import Chart from 'chart.js/auto';
function updatePreviewHeader(text) {
    // Get the reference to the custom element
    const myComponent = document.querySelector('my-component');
    if (myComponent) {
      // Access the shadow root and update the preview-thead element
      const previewThead = myComponent.shadowRoot.querySelector('.form-group label');
      if (previewThead) {
        previewThead.textContent = text;
      }
      const showPage1 = myComponent.shadowRoot.querySelector('#showpage1');

      showPage1.addEventListener('click', () => {
        myComponent.shadowRoot.querySelector('dile-pages').selected="page1";
      });
    }
  }

  function showPreview() {
    const modalComponent = document.querySelector('modal-component');
    if (modalComponent) {
      const thead = modalComponent.shadowRoot.querySelector('#preview-thead');
      const tbody = modalComponent.shadowRoot.querySelector('#preview-tbody');
      thead.innerHTML = ''; // Clear previous headers
      tbody.innerHTML = '';
  
      // Generate headers dynamically
      const headerRow = document.createElement('tr');
      for (let i = 0; i < 15; i++) {
        const headerCell = document.createElement('th');
        headerCell.textContent = 'asd';
        headerRow.appendChild(headerCell);
      }
      thead.appendChild(headerRow); // Append header row once
  
      // Generate rows dynamically
      for (let i = 0; i < 15; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 15; j++) {
          const cell = document.createElement('td');
          cell.textContent = 'value';
          row.appendChild(cell);
        }
        tbody.appendChild(row); // Append row with cells
      }
  
      modalComponent.shadowRoot.querySelector('#preview').style.display = 'block';
    }
  }
  
  // Example of calling the external function
  document.addEventListener('component-ready', () => {
    updatePreviewHeader('Imported ');
  });
  
  document.addEventListener('modal-ready', () => {
    const modalComponent = document.querySelector('modal-component');
    if (modalComponent) {
      
      const previewBtn = modalComponent.shadowRoot.querySelector('#preview-btn');
      console.log('modal comp', modalComponent, 'and preview btn', previewBtn);
      previewBtn.addEventListener('click', () => {
        showPreview();
      })
    }

  })

  document.getElementById('toggleBtn').addEventListener('click', function() {
    const sidePanel = document.getElementById('sidePanel');
    sidePanel.classList.toggle('expanded');
  });


  const data = [
    {
        "Дата и время": "19/06/2024 17:05:29",
        "Событие": "rate",
        "Номер вопроса": 7,
        "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
        "Оценка": "10",
        "Комментарий": "",
        "Сотрудник": "example@example.ru",
        "Должность": "Специалист",
        "Табельный Номер": "21909",
        "Подразделение": "Централизованные фун",
        "Дивижн": "Отдел контроля и учета ЕГАИС"
    },
    {
        "Дата и время": "19/06/2024 17:05:51",
        "Событие": "rate",
        "Номер вопроса": 8,
        "Вопрос": "\"Напишите ваши предложения по улучшению взаимодействия с сервис-менеджеров Х Технологии.\"",
        "Оценка": "Предложений нет",
        "Комментарий": "",
        "Сотрудник": "example@example.com",
        "Должность": "Специалист",
        "Табельный Номер": "21905",
        "Подразделение": "Централизованные фун",
        "Дивижн": "Отдел контроля и учета ЕГАИС"
    },
    {
        "Дата и время": "19/06/2024 17:08:29",
        "Событие": "rate",
        "Номер вопроса": 7,
        "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
        "Оценка": "8",
        "Комментарий": "",
        "Сотрудник": "example4@example.ru",
        "Должность": "Специалист",
        "Табельный Номер": "21998909",
        "Подразделение": "Централизованные фун",
        "Дивижн": "Отдел контроля и учета ЕГАИС"
    },
    {
      "Дата и время": "19/06/2024 17:08:29",
      "Событие": "rate",
      "Номер вопроса": 7,
      "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
      "Оценка": "9",
      "Комментарий": "",
      "Сотрудник": "example4@example.ru",
      "Должность": "Специалист",
      "Табельный Номер": "21998909",
      "Подразделение": "Централизованные фун",
      "Дивижн": "Отдел контроля и учета ЕГАИС"
  },
  {
    "Дата и время": "19/06/2024 17:08:29",
    "Событие": "rate",
    "Номер вопроса": 7,
    "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
    "Оценка": "9",
    "Комментарий": "",
    "Сотрудник": "example4@example.ru",
    "Должность": "Специалист",
    "Табельный Номер": "21998909",
    "Подразделение": "Централизованные фун",
    "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
  "Оценка": "2",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
  "Оценка": "5",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
  "Оценка": "5",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
  "Оценка": "2",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "\"Насколько качественно вам предоставляется обратная связь по вашим запросам от сервис-менеджера ?Оцените от 1 до 10, укажите комментарии в случае оценки ниже 7.\"",
  "Оценка": "2",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:05:51",
  "Событие": "rate",
  "Номер вопроса": 8,
  "Вопрос": "\"Напишите ваши предложения по улучшению взаимодействия с сервис-менеджеров Х Технологии.\"",
  "Оценка": "Как там таблички",
  "Комментарий": "",
  "Сотрудник": "example@example.com",
  "Должность": "Специалист",
  "Табельный Номер": "21905",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:05:51",
  "Событие": "rate",
  "Номер вопроса": 8,
  "Вопрос": "\"Напишите ваши предложения по улучшению взаимодействия с сервис-менеджеров Х Технологии.\"",
  "Оценка": "Как там все ли ок",
  "Комментарий": "",
  "Сотрудник": "example@example.com",
  "Должность": "Специалист",
  "Табельный Номер": "21905",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:05:51",
  "Событие": "rate",
  "Номер вопроса": 8,
  "Вопрос": "\"Напишите ваши предложения по улучшению взаимодействия с сервис-менеджеров Х Технологии.\"",
  "Оценка": "Как там все ли ок",
  "Комментарий": "",
  "Сотрудник": "example@example.com",
  "Должность": "Специалист",
  "Табельный Номер": "21905",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
{
  "Дата и время": "19/06/2024 17:08:29",
  "Событие": "rate",
  "Номер вопроса": 7,
  "Вопрос": "asddsa тест вопрос асдадсаасд асд",
  "Оценка": "дса тест оценка ааааааа аааааа   аааааааа ааааа аааааа аса дсааа сссссссссссс дс",
  "Комментарий": "",
  "Сотрудник": "example4@example.ru",
  "Должность": "Специалист",
  "Табельный Номер": "21998909",
  "Подразделение": "Централизованные фун",
  "Дивижн": "Отдел контроля и учета ЕГАИС"
},
];

// function distributeRating(data) {
//   const numericalRatings = {};
//   const nonNumericalRatings = {};

//   data.forEach(entry => {
//       const rating = entry.Оценка;
//       const question = entry.Вопрос;
//       if (!isNaN(rating)) { // Ensure the rating is a number and not "Предложений нет"
//           const numericRating = parseInt(rating, 10);
//           if (numericalRatings.hasOwnProperty(numericRating)) {
//               numericalRatings[numericRating].count++;
//               if (!numericalRatings[numericRating].questions.includes(question)) {
//                   numericalRatings[numericRating].questions.push(question);
//               }
//           } else {
//               numericalRatings[numericRating] = { count: 1, questions: [question] };
//           }
//       } else {
//           if (nonNumericalRatings.hasOwnProperty(rating)) {
//               nonNumericalRatings[rating].count++;
//               if (!nonNumericalRatings[rating].questions.includes(question)) {
//                   nonNumericalRatings[rating].questions.push(question);
//               }
//           } else {
//               nonNumericalRatings[rating] = { count: 1, questions: [question] };
//           }
//       }
//   });

//   return { numericalRatings, nonNumericalRatings };
// }

// let { numericalRatings, nonNumericalRatings } = distributeRating(data);

// const numericalLabels = Object.keys(numericalRatings);
// const numericalValues = Object.values(numericalRatings).map(item => item.count);
// const numericalQuestions = Object.values(numericalRatings).map(item => item.questions.join('\n'));

// const nonNumericalLabels = Object.keys(nonNumericalRatings);
// const nonNumericalValues = Object.values(nonNumericalRatings).map(item => item.count);
// const nonNumericalQuestions = Object.values(nonNumericalRatings).map(item => item.questions.join('\n'));

// // Numerical Rating Chart
// const numericalCtx = document.getElementById('numericalRatingChart').getContext('2d');
// const numericalRatingChart = new Chart(numericalCtx, {
//   type: 'bar',
//   data: {
//       labels: numericalLabels,
//       datasets: [{
//           label: 'Общее количество оценок (Numerical)',
//           data: numericalValues,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(85, 192, 192, 1)',
//           borderWidth: 1,
//           maxBarThickness: 250
//       }],
//   },
//   options: {
//       scales: {
//           y: {
//               beginAtZero: true,
//               ticks: {
//                   stepSize: 1
//               }
//           }
//       },
//       plugins: {
//           tooltip: {
//               callbacks: {
//                   afterLabel: function(context) {
//                       return numericalQuestions[context.dataIndex];
//                   }
//               }
//           }
//       }
//   }
// });

// // Non-Numerical Rating Chart
// const nonNumericalCtx = document.getElementById('nonNumericalRatingChart').getContext('2d');
// const nonNumericalRatingChart = new Chart(nonNumericalCtx, {
//   type: 'bar',
//   data: {
//       labels: nonNumericalLabels,
//       datasets: [{
//           label: 'Общее количество оценок (Non-Numerical)',
//           data: nonNumericalValues,
//           backgroundColor: 'rgba(255, 159, 64, 0.2)',
//           borderColor: 'rgba(255, 159, 64, 1)',
//           borderWidth: 1,
//           maxBarThickness: 250
//       }],
//   },
//   options: {
//       scales: {
//           y: {
//               beginAtZero: true,
//               ticks: {
//                   stepSize: 1
//               }
//           },
//       },
//       plugins: {
//           tooltip: {
//               callbacks: {
//                   afterLabel: function(context) {
//                       return nonNumericalQuestions[context.dataIndex];
//                   }
//               }
//           }
//       }
//   }
// });



// Initialize empty objects globally
let numericalRatings = {};
let nonNumericalRatings = {};

// Variables to hold the chart instances
let numericalChartInstance = null;
let nonNumericalChartInstance = null;

// Call distributeRating with the data
const result = distributeRating(data); 
numericalRatings = result.numericalRatings;
nonNumericalRatings = result.nonNumericalRatings;

// Now you can use these objects to create charts or do other operations
createCharts(numericalRatings, nonNumericalRatings);



function distributeRating(data) {
const numericalRatings = {};
const nonNumericalRatings = {};

data.forEach(entry => {
  const rating = entry.Оценка ? entry.Оценка : entry.Комментарий;
  const question = entry.Вопрос;
  if (!rating || !question) {
      return;
  }
  if (!isNaN(rating)) { 
      const numericRating = parseInt(rating, 10);
      if (numericalRatings.hasOwnProperty(numericRating)) {
          numericalRatings[numericRating].count++;
          if (!numericalRatings[numericRating].questions.includes(question)) {
              numericalRatings[numericRating].questions.push(question);
          }
      } else {
          numericalRatings[numericRating] = { count: 1, questions: [question] };
      }
  } else {
      if (nonNumericalRatings.hasOwnProperty(rating)) {
          nonNumericalRatings[rating].count++;
          if (!nonNumericalRatings[rating].questions.includes(question)) {
              nonNumericalRatings[rating].questions.push(question);
          }
      } else {
          nonNumericalRatings[rating] = { count: 1, questions: [question] };
      }
  }
});
console.log(numericalRatings, nonNumericalRatings, 'ratings to check')
return { numericalRatings, nonNumericalRatings };
}

function createCharts(numericalRatings, nonNumericalRatings) {
  // Prepare data for numerical ratings scatter plot
  const numericalData = Object.keys(numericalRatings).map((rating) => {
      const { count, questions } = numericalRatings[rating];
      return {
          value: [parseInt(rating), count],
          questions: questions.join('\n'),
      };
  });

  // Prepare data for non-numerical ratings scatter plot
  const nonNumericalData = Object.keys(nonNumericalRatings).map((rating) => {
      const { count, questions } = nonNumericalRatings[rating];
      return {
          value: [rating, count],
          questions: questions.join('\n'),
      };
  });

  // Destroy existing chart instances if they exist
  if (numericalChartInstance) {
      numericalChartInstance.dispose();
  }
  if (nonNumericalChartInstance) {
      nonNumericalChartInstance.dispose();
  }

  // Create numerical ratings scatter plot
  numericalChartInstance = echarts.init(document.getElementById('numericalRatingChart'));
  numericalChartInstance.setOption({
      title: {
          text: 'Числовые оценки',
      },
      tooltip: {
          formatter: function (params) {
              return `${params.value[0]}: ${params.data.questions}`;
          },
      },
      xAxis: {
          type: 'value',
          name: 'Оценка',
      },
      yAxis: {
          type: 'value',
          name: 'Количество',
      },
      visualMap: {
          min: 0,
          max: Math.max(...numericalData.map(d => d.value[1])),
          dimension: 1,
          inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d'],
          },
      },
      series: [{
          type: 'scatter',
          data: numericalData,
          symbolSize: function (data) {
              return data[1] * 10;
          },
          emphasis: {
              label: {
                  show: true,
                  formatter: function (param) {
                      return `${param.value[0]}: ${param.data.questions}`;
                  },
                  position: 'top',
              },
          },
      }],
  });

  // Create non-numerical ratings scatter plot
  nonNumericalChartInstance = echarts.init(document.getElementById('nonNumericalRatingChart'));
  nonNumericalChartInstance.setOption({
      title: {
          text: 'Нечисловые оценки',
      },
      tooltip: {
          formatter: function (params) {
              return `${params.value[0]}: ${params.data.questions}`;
          },
      },
      xAxis: {
          type: 'category',
          name: 'Оценка',
      },
      yAxis: {
          type: 'value',
          name: 'Количество',
      },
      visualMap: {
          min: 0,
          max: Math.max(...nonNumericalData.map(d => d.value[1])),
          dimension: 1,
          inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d'],
          },
      },
      series: [{
          type: 'scatter',
          data: nonNumericalData,
          symbolSize: function (data) {
              return data[1] * 10;
          },
          emphasis: {
              label: {
                  show: true,
                  formatter: function (param) {
                      return `${param.value[0]}: ${param.data.questions}`;
                  },
                  position: 'top',
              },
          },
      }],
  });
}