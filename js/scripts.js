var urlParams = new URLSearchParams(window.location.search);


function stringGen(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

function notify(msg, mode, duration) {
  var classy = stringGen(9);
  $('.notifications').append(`<div id='${classy}' class='notification is-${mode} slideInRight'><h2 class='is-size-5'>${msg}</h2></div>`)
  $('.notification').click(function() {
    $(this).removeClass('slideInRight');
    $(this).addClass('slideOutRight');
    setTimeout(function() {
      $(this).remove();
    }, 350);
  });
  setTimeout(function() {
    $(`#${classy}`).removeClass('slideInRight');
    $(`#${classy}`).addClass('slideOutRight');
    setTimeout(function() {
      $(`#${classy}`).remove();
    }, 350);
  }, duration);
}

function check_out(check_out_id) {
  $('#confirm').addClass('show_confirm');
  $('.do_confirm').click(function() {
    $('#confirm').removeClass('show_confirm');
    $.ajax({
      type: "POST",
      data: {
        'check_out_id': check_out_id
      },
      async: false,
      url: 'php/check_out.php',
      success: function(data) {
        console.log(data);
        $('#check_out').hide();
        $('#title').text('');
        $('#checked_out').addClass('show_confirm');
        setTimeout(function() {
          $('#checked_out').removeClass('show_confirm');
          $('#home_btn').click();
        }, 3000);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
}

function get_cars() {
  if (urlParams.has('app')) {
    var app = 1;
  } else {
    var app = 0;
  }
  $.ajax({
    type: "POST",
    url: 'php/read.php',
    data: {
      'app': app
    },
    success: function(data) {
      var express_code = parseInt($('input[name="express_code"]').val());
      console.log(express_code);
      $.each(JSON.parse(data), function(i, item) {
        var datetime = moment(item.time_in).format('MMMM Do');
        var time_in = moment(item.time_in).format('HH:mm');
        if (item.time_out != '-') {
          var time_out = moment(item.time_out).format('HH:mm');
          var car_colour = 'red_car';
        } else {
          var car_colour = 'green_car';
          var time_out = '-';
        }
        if (app == true) {
          var del = `<td class='check_out_table red_car'><i class="fas fa-lg fa-sign-out-alt"></i></td>`;
        } else {
          if (express_code == item.express_code) {
            var del = `<td class='check_out_table red_car'><i class="fas fa-lg fa-sign-out-alt"></i></td>`;
          } else {
            var del = `<td class='disabled'><i class="fas fa-lg fa-sign-out-alt"></i></td>`;
          }
        }
        $('#search_results').append(`
        <tr data-id='${item.id}'>
          <td class='is-hidden-mobile'><i class="${car_colour} fas fa-lg fa-car"></i></td>
          <td class='is-capitalized is-hidden-mobile'>${item.name}</td>
          <td class='is-capitalized is-hidden-mobile'>${item.company}</td>
          <td class='is-uppercase'>${item.license}</td>
          <td class='is-hidden-mobile'>${item.express_code}</td>
          <td class='is-hidden-mobile'>${datetime}</td>
          <td class='is-hidden-mobile'>${time_in}</td>
          ${del}
        </tr>
      `);
      });
      $('.check_out_table').click(function() {
        var check_out_id = $(this).parent('tr').attr('data-id');
        check_out(check_out_id);
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function get_all_cars() {
  $.ajax({
    type: "GET",
    url: 'php/read_all.php',
    success: function(data) {
      $.each(JSON.parse(data), function(i, item) {
        var datetime = moment(item.time_in).format('MMMM Do');
        var time_in = moment(item.time_in).format('HH:mm');
        if (item.time_out != '-') {
          var time_out = moment(item.time_out).format('HH:mm');
          var car_colour = 'red_car';
        } else {
          var car_colour = 'green_car';
          var time_out = '-';
        }
        $('#done_results').append(`
        <tr data-id='${item.id}'>
          <td><i class="${car_colour} fas fa-lg fa-car"></i></td>
          <td class='is-capitalized'>${item.name}</td>
          <td class='is-capitalized'>${item.company}</td>
          <td class='is-uppercase'>${item.license}</td>
          <td>${item.express_code}</td>
          <td>${datetime}</td>
          <td>${time_in}</td>
          <td>${time_out}</td>
        </tr>
      `);
      });
      $('.check_out_table').click(function() {
        var check_out_id = $(this).parent('tr').attr('data-id');
        check_out(check_out_id);
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
}


function get_stats() {
  $.ajax({
    type: "GET",
    url: 'php/stats.php',
    success: function(data) {
      $.each(JSON.parse(data), function(i, item) {
        $('#cars_here').text(item.cars_here);
        $('#total_cars').text(item.total_cars);
        $('#total_company').text(item.total_company);
        $('#total_people').text(item.total_people);
      });

    },
    error: function(error) {
      console.log(error);
    }
  });
}

function get_session() {
  $.ajax({
    type: "GET",
    url: 'php/session.php',
    success: function(data) {
      console.log(data);
      $('input[name="express_code"]').val(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function update() {
  $('#clock').text(moment().format('HH:mm'));
}

//$(document).idle({
//  onIdle: function() {
//    $('#home_btn').click();
//  },
//  idle: 60000
//})

$(".clock").click(function() {
  var body = document.documentElement;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitrequestFullscreen) {
    body.webkitrequestFullscreen();
  } else if (body.mozrequestFullscreen) {
    body.mozrequestFullscreen();
  } else if (body.msrequestFullscreen) {
    body.msrequestFullscreen();
  }
});

$(function() {
  if (!urlParams.has('app')) {
    get_session();
  }

  update();
  setInterval(update, 1000);
  $('body').append("<div class='notifications'></div>");

  $('.close_confirm').click(function() {
    $('#confirm').removeClass('show_confirm');
  });

  $('#check_in').submit(function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
      type: "POST",
      data: data,
      url: 'php/add.php',
      success: function(data) {
        $('input:not(input.submit)').val('');
        $('#title').html('');
        $('#code').text(data);
        $('#check_in').hide();
        $('#results').show();
        $('#results').addClass('show_confirm');
        get_session();
        setTimeout(function() {
          $('#results').removeClass('show_confirm');
          $('#home_btn').click();
        }, 3000);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $('#express').submit(function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
      type: "POST",
      data: data,
      url: 'php/express.php',
      success: function(data) {
        console.log(data);
        $('#express_msg').text(data);
        $('#title').html('');
        $('#express').hide();
        $('#express_results').addClass('show_confirm');
        setTimeout(function() {
          $('#express_results').removeClass('show_confirm');
          $('#home_btn').click();
        }, 3000);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $('#home_btn').click(function() {
    $('li').removeClass('is-active');
    $('#title').html('<i class="fas fa-6x fa-lg fa-car"></i><br>Please register your vehicle');
    $('#check_in').hide();
    $('#check_out').hide();
    $('#help').hide();
    $('#results').hide();
    $('#express').hide();
  });

  $('#help_btn').click(function() {
    $('li').removeClass('is-active');
    $(this).parent('li').addClass('is-active');
    $('#title').text('Info');
    $('#check_in').hide();
    $('#check_out').hide();
    $('#search').hide();
    $('#help').show();
    $('#results').hide();
    $('#express').hide();
  });

  $('#check_in_btn').click(function() {
    $('li').removeClass('is-active');
    $(this).parent('li').addClass('is-active');
    $('#title').text('Check In');
    $('#check_in').show();
    $('#check_out').hide();
    $('#search').hide();
    $('#help').hide();
    $('#express').hide();
    $('#results').hide();
  });

  $('#check_out_btn').click(function() {
    $('li').removeClass('is-active');
    $(this).parent('li').addClass('is-active');
    $('#title').text('Check Out');
    $('#check_in').hide();
    $('#check_out').show();
    $('#search').hide();
    $('#help').hide();
    $('#results').hide();
    $('#express').hide();
    $('#search_results').html('');
    get_cars();
  });

  $('#express_btn').click(function() {
    $('li').removeClass('is-active');
    $(this).parent('li').addClass('is-active');
    $('#title').text('Express');
    $('#check_in').hide();
    $('#check_out').hide();
    $('#search').hide();
    $('#help').hide();
    $('#results').hide();
    $('#express').show();
  });

});
