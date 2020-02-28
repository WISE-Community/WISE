<%@ include file="../../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%@ include file="../../favicon.jsp"%>
<title><spring:message code="forgotaccount.student.passwordreminder.forgotPasswordStudentReminder"/></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="stylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<c:if test="${textDirection == 'rtl' }">
    <link href="${contextPath}/<spring:theme code="rtlstylesheet"/>" rel="stylesheet" type="text/css" >
</c:if>

<script src="${contextPath}/<spring:theme code="generalsource"/>" type="text/javascript"></script>

</head>
<body>
<div id="pageWrapper">

	<div id="page">

		<div id="pageContent" style="min-height:400px;">
			<div id="headerSmall">
				<a id="name" href="${contextPath}/" title="<spring:message code="wiseHomepage" />"><spring:message code="wise" /></a>
			</div>

			<div class="infoContent">
				<div class="panelHeader"><spring:message code="forgotaccount.student.passwordreminder.studentLostUsernamePassword"/></div>
				<div class="infoContentBox">
					<div><spring:message code="forgotaccount.student.passwordreminder.step1"/>: <spring:message code="forgotaccount.student.passwordreminder.enterYourWISEUsername"/>:</div>
					<div>
						<form:form id="username" name="retrievepassword" method="post" modelAttribute="passwordReminderParameters" autocomplete='off'>
							<label style="font-weight:bold;" for="username"><spring:message code="forgotaccount.student.passwordreminder.username" />:</label>
				  			<input class="dataBoxStyle" type="text" name="username" id="username" size="20" tabindex="1" />

							<!-- 			Special script pulls focus onto immediately preceding Input field-->
				 			<script type="text/javascript">document.getElementById('username').focus();
							</script>
							<input type="hidden" name="_page" value="1" />
							<input style="margin-left:20px; text-align:center;width:55px;" type="submit" id="next" name="_target1" value="<spring:message code="forgotaccount.student.passwordreminder.next" />" />
						</form:form>
					</div>
					<div class="instructions"><spring:message code="forgotaccount.student.passwordreminder.remember"/></div>
					<div class="errorMsgNoBg">
						<!-- Support for Spring errors object -->
						<spring:bind path="passwordReminderParameters.*">
						  <c:forEach var="error" items="${status.errorMessages}">
						    <p><c:out value="${error}" escapeXml="false"/></p>
						  </c:forEach>
						</spring:bind>
					</div>
					<div><a id="forgotUsernameLink" href="searchforstudentusername"><spring:message code="forgotaccount.student.passwordreminder.iCantRememberUsername"/></a></div>
				</div>
				<a href="${contextPath}/" title="<spring:message code="wiseHome" />"><spring:message code="returnHome"/></a>
			</div>
		</div>
	</div>
</div>
</body>
</html>
