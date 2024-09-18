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
    var editButton = document.createElement('button');

    textSpan.textContent = taskText;
    dateSpan.textContent = taskDate ? ' - ' + new Date(taskDate + 'T00:00:00').toLocaleDateString() : '';
    completeCheckbox.type = 'checkbox';
    deleteButton.textContent = 'Excluir';
    editButton.textContent = 'Editar';

    completeCheckbox.classList.add('complete');
    deleteButton.classList.add('delete');
    editButton.classList.add('edit');

    deleteButton.onclick = function() {
      listItem.remove();
    };

    completeCheckbox.onclick = function() {
      listItem.classList.toggle('completed', completeCheckbox.checked);
    };

    editButton.onclick = function() {
      var newTaskText = prompt("Alterar Tarefa:", textSpan.textContent);
      if (newTaskText !== null) {
        textSpan.textContent = newTaskText;
      }
      var newTaskDate = prompt("Alterar Data (DD-MM-YYYY):", taskDate);
      if (newTaskDate !== null) {
        taskDate = newTaskDate;
        dateSpan.textContent = taskDate ? ' - ' + new Date(taskDate + 'T00:00:00').toLocaleDateString() : '';
      }
    };

    listItem.appendChild(completeCheckbox);
    listItem.appendChild(textSpan);
    listItem.appendChild(dateSpan);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    taskInput.value = '';
    dateInput.value = '';
  }
}

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

  // Use event delegation to handle dynamic content
  $('#taskList').on('click', '.edit', function () {
    var listItem = $(this).closest('li');
    var textSpan = listItem.find('span').first();
    var dateSpan = listItem.find('span').last();
    
  });

  $('#taskList').on('click', '.delete', function () {
    $(this).closest('li').remove();
  });

  $('#taskList').on('click', '.complete', function () {
    $(this).closest('li').toggleClass('completed', this.checked);
  });
});
