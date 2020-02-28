<%@ include file="../../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%@ include file="../../favicon.jsp"%>
<title><spring:message code="forgotaccount.student.passwordreminder2.passwordReminderStep2"/></title>

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
				<a id="name" href="${contextPath}/" title="<spring:message code="wiseHomepage" />"><spring:message code="wiseHome" /></a>
			</div>

			<div class="infoContent">
				<div class="panelHeader"><spring:message code="forgotaccount.student.passwordreminder2.studentLostUsernamePassword"/></div>
				<div class="infoContentBox">
					<div><spring:message code="forgotaccount.student.passwordreminder2.step2"/></div>
					<div><spring:message code="forgotaccount.student.passwordreminder2.hello"/>, ${username}. <spring:message code="forgotaccount.student.passwordreminder2.answerPasswordReminderQuestion"/></div>
					<form id="submittedAccountAnswer" method="post" modelAttribute="passwordReminderParameters" autocomplete='off'>
						<div><spring:message code="forgotaccount.student.passwordreminder2.question"/>: <spring:message code="forgotaccount.student.passwordreminder2.${accountQuestion}"/></div>
						<div class="forgotPasswordInstructionText3">
							<label for="submittedAnswer"><spring:message code="forgotaccount.student.passwordreminder2.answer"/>:</label>
							<input type="text" name="submittedAccountAnswer" id="submittedAnswer"  class="dataBoxStyle"
						  			style="width: 250px;" tabindex="1" />

				 			<script type="text/javascript">document.getElementById('submittedAnswer').focus();
				 			</script>

							<input type="hidden" name="_page" value="2" />
						  	<input style="margin-left:20px; text-align:center;width:55px;" type="submit" name="_target2" value="<spring:message code="forgotaccount.student.passwordreminder2.next" />">
						</div>
					</form>

					<div class="errorMsgNoBg">
							<!-- Support for Spring errors object -->
							<spring:bind path="passwordReminderParameters.*">
							  <c:forEach var="error" items="${status.errorMessages}">
							    <p><c:out value="${error}" escapeXml="false"/></p>
							  </c:forEach>
							</spring:bind>
					</div>
				</div>
				<a href="${contextPath}/" title="<spring:message code="wiseHome" />"><spring:message code="returnHome"/></a>
			</div>
		</div>
	</div>
</div>
</body>
</html>
