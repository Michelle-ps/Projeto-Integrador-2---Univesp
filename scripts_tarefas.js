document.getElementById('addTaskBtn').addEventListener('click', addTask);

function addTask() {
  var taskInput = document.getElementById('taskInput');
  var dateInput = document.getElementById('dateInput');
  var taskList = document.getElementById('taskList');
  var taskText = taskInput.value.trim();
  var taskDate = dateInput.value;

  if (taskText) {
    var listItem = document.createElement('li');
    var textSpan = document.createElement('span');
    var dateSpan = document.createElement('span');
    var completeCheckbox = document.createElement('input');
    var deleteButton = document.createElement('button');

    textSpan.textContent = taskText;
    dateSpan.textContent = taskDate ? ' - ' + new Date(taskDate + 'T00:00:00').toLocaleDateString() : '';
    completeCheckbox.type = 'checkbox';
    deleteButton.textContent = 'Excluir';

    completeCheckbox.classList.add('complete');
    deleteButton.classList.add('delete');

    deleteButton.onclick = function() {
      listItem.remove();
    };
    completeCheckbox.onclick = function() {
      listItem.classList.toggle('completed', completeCheckbox.checked);
    };

    listItem.appendChild(completeCheckbox);
    listItem.appendChild(textSpan);
    listItem.appendChild(dateSpan);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    taskInput.value = '';
    dateInput.value = '';
  }
}


//

$(document).ready(function () {
  $('#addTaskBtn').on('click', function () {
    var taskInput = $('#taskInput').val();
    var dateInput = $('#dateInput').val();

    $.ajax({
      type: 'POST',
      url: '/add_task/',
      data: {
        'task_text': taskInput,
        'task_date': dateInput,
        csrfmiddlewaretoken: '{{ csrf_token }}',
      },
      success: function (data) {
        $('#taskList').append(data);
        $('#taskInput').val('');
        $('#dateInput').val('');
      }
    });
  });
});
