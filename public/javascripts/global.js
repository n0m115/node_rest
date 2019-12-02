// Userlist data array for filling in info box
let userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Edit User link click
    $('#userList table tbody').on('click', 'td a.loadedituser', loadedituser);

    // Edit User button click
    $('#btnEditUser').on('click', editUser);

    // User form reset
    $('#btnReset').on('click', function() {
        // Clear the form inputs
        $('#addUser fieldset input').val('');
        $("#btnAddUser").show();
        $("#btnEditUser").hide();
    });

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    let tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/users', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            
            // Stick our user data array into a userlist variable in the global object
            userListData = data;
            tableContent += '<tr>';
            tableContent += '<td>' + this._id + '</td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Delete</a> | <a href="#" class="loadedituser" rel="' + this._id + '">Edit</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function getUserInfo(id) {
    
    let json;
    $.get('/api/user/' + id, function(res) {
        json = res;
    });
    
    return json;
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    let thisUserId = $(this).attr('rel');

    $.getJSON('/api/user/' + thisUserId, function(thisUserObject) {
        //Populate Info Box
        $('#userInfoName').text(thisUserObject.fullname);
        $('#userInfoAge').text(thisUserObject.age);
        $('#userInfoGender').text(thisUserObject.gender);
        $('#userInfoLocation').text(thisUserObject.location);
    });
};

function validateForm() {
    // Super basic validation - increase errorCount variable if any fields are blank
    let errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {
            console.log(index); errorCount++;
        }
    });

    return errorCount;
}

// Add User
function addUser(event) {
    event.preventDefault();

    // $("#inputUserId").attr("disabled", "disabled");
    let errorCount = validateForm();

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        let newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/api/user',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                $("#btnReset").trigger('click');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Edit User
// Show User Info
function loadedituser(event) {

    // Prevent Link from Firing
    event.preventDefault();

    let thisUserId = $(this).attr('rel');

    $.get('/api/user/' + thisUserId, function(thisUserObject) {
        //Populate form
        $('#inputUserName').val(thisUserObject.username);
        $('#inputUserEmail').val(thisUserObject.email);
        $('#inputUserFullname').val(thisUserObject.fullname);
        $('#inputUserAge').val(thisUserObject.age);
        $('#inputUserLocation').val(thisUserObject.location);
        $('#inputUserGender').val(thisUserObject.gender);
        $('#btnEditUser').attr("data-id", thisUserObject._id);
    });

    $("#btnAddUser").hide();
    $("#btnEditUser, #btnReset").show();

};

// Edit User
function editUser(event) {
    event.preventDefault();

    let errorCount = validateForm();
    let id = $("#btnEditUser").attr("data-id");

    // Check and make sure errorCount's still at zero
    if(errorCount === 0 && id != '') {


        // If it is, compile all user info into one object
        let updateUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: updateUser,
            url: '/api/user/' + id,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                $("#btnReset").trigger('click');

                // Update the table
                populateTable();
                $("#btnEditUser").attr("data-id", "");

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    let confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/api/user/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
};