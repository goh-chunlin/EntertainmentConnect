function showOrHideMainProgressBar(isShow) {
    document.getElementById('mainLoadingProgressBar').style.display = isShow ? 'inline' : 'none';
}

function showMessage(messageTitle, messageContent) {
    var messageDialog = new Windows.UI.Popups.MessageDialog(messageContent, messageTitle);

    messageDialog.showAsync();
}