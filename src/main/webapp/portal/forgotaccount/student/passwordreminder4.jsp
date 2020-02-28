<%@ include file="../../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%@ include file="../../favicon.jsp"%>
<title><spring:message code="forgotaccount.student.passwordreminder4.passwordReminderStep4"/></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="stylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<c:if test="${textDirection == 'rtl' }">
    <link href="${contextPath}/<spring:theme code="rtlstylesheet"/>" rel="stylesheet" type="text/css" >
</c:if>

</head>
<body>
<div id="pageWrapper">

	<div id="page">

		<div id="pageContent" style="min-height:400px;">
			<div id="headerSmall">
				<a id="name" href="${contextPath}/" title="<spring:message code="wiseHomepage"/>"><spring:message code="wise"/></a>
			</div>

			<div class="infoContent">
				<div class="panelHeader"><spring:message code="forgotaccount.student.passwordreminder4.studentLostUsernamePassword"/></div>
				<div class="infoContentBox">
					<div><spring:message code="forgotaccount.student.passwordreminder4.yourUsernameIsStill"/>&nbsp;<span style="font-weight:bold;">${username}.</span></div>
					<div class="errorMsgNoBg"><p><spring:message code="forgotaccount.student.passwordreminder4.yourPasswordHasBeenChanged"/></p></div>
					<div><spring:message code="forgotaccount.student.passwordreminder4.clickOnButtonToSignIn"/></div>
				</div>
				<a href="${contextPath}/login" class="wisebutton" style="margin-top:.25em;"><spring:message code="forgotaccount.student.passwordreminder4.signIn"/></a>
			</div>
		</div>
	</div>
</div>
</body>
</html>
