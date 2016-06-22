package org.wise.vle.web.wise5;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.wise.portal.dao.ObjectNotFoundException;
import org.wise.portal.domain.run.Run;
import org.wise.portal.domain.user.User;
import org.wise.portal.presentation.web.controllers.ControllerUtil;
import org.wise.portal.service.offering.RunService;
import org.wise.portal.service.vle.wise5.VLEService;
import org.wise.vle.domain.annotation.wise5.Annotation;
import org.wise.vle.domain.work.Event;
import org.wise.vle.domain.work.StudentWork;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Set;

/**
 *
 */
@Controller("wise5TeacherDataController")
public class TeacherDataController {
    @Autowired
    private VLEService vleService;

    @Autowired
    private RunService runService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/teacher/export/{runId}/{exportType}")
    public void getWISE5TeacherData(
            @PathVariable Integer runId,
            @PathVariable String exportType,
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "periodId", required = false) Integer periodId,
            @RequestParam(value = "workgroupId", required = false) Integer workgroupId,
            @RequestParam(value = "isAutoSave", required = false) Boolean isAutoSave,
            @RequestParam(value = "isSubmit", required = false) Boolean isSubmit,
            @RequestParam(value = "nodeId", required = false) String nodeId,
            @RequestParam(value = "componentId", required = false) String componentId,
            @RequestParam(value = "componentType", required = false) String componentType,
            HttpServletResponse response) {
        try {
            if ("allStudentWork".equals(exportType) || "latestStudentWork".equals(exportType)) {
                JSONArray resultArray = vleService.getStudentWorkExport(runId);
                PrintWriter writer = response.getWriter();
                writer.write(resultArray.toString());
                writer.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/teacher/data")
    public void getWISE5TeacherData(
            HttpServletResponse response,
            @RequestParam(value = "getStudentWork", defaultValue = "false") boolean getStudentWork,
            @RequestParam(value = "getEvents", defaultValue = "false") boolean getEvents,
            @RequestParam(value = "getAnnotations", defaultValue = "false") boolean getAnnotations,
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "runId", required = false) Integer runId,
            @RequestParam(value = "periodId", required = false) Integer periodId,
            @RequestParam(value = "workgroupId", required = false) Integer workgroupId,
            @RequestParam(value = "isAutoSave", required = false) Boolean isAutoSave,
            @RequestParam(value = "isSubmit", required = false) Boolean isSubmit,
            @RequestParam(value = "nodeId", required = false) String nodeId,
            @RequestParam(value = "componentId", required = false) String componentId,
            @RequestParam(value = "componentType", required = false) String componentType,
            @RequestParam(value = "context", required = false) String context,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "event", required = false) String event,
            @RequestParam(value = "fromWorkgroupId", required = false) Integer fromWorkgroupId,
            @RequestParam(value = "toWorkgroupId", required = false) Integer toWorkgroupId,
            @RequestParam(value = "studentWorkId", required = false) Integer studentWorkId,
            @RequestParam(value = "annotationType", required = false) String annotationType

    ) {
        JSONObject result = new JSONObject();
        if (getStudentWork) {
            List<StudentWork> studentWorkList = vleService.getStudentWorkList(id, runId, periodId, workgroupId,
                    isAutoSave, isSubmit, nodeId, componentId, componentType);

            JSONArray studentWorkJSONArray = new JSONArray();

            // loop through all the component states
            for (int c = 0; c < studentWorkList.size(); c++) {
                StudentWork studentWork = studentWorkList.get(c);

                // get the JSON representation of the component state and add to studentWorkJSONArray
                studentWorkJSONArray.put(studentWork.toJSON());
            }
            try {
                result.put("studentWorkList", studentWorkJSONArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        if (getEvents) {
            List<Event> events = vleService.getEvents(id, runId, periodId, workgroupId,
                    nodeId, componentId, componentType, context, category, event);

            JSONArray eventsJSONArray = new JSONArray();

            // loop through all the events
            for (int e = 0; e < events.size(); e++) {
                Event eventObject = events.get(e);

                // get the JSON representation of the event and add to eventsJSONArray
                eventsJSONArray.put(eventObject.toJSON());
            }
            try {
                result.put("events", eventsJSONArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        if (getAnnotations) {
            List<Annotation> annotations = vleService.getAnnotations(
                    id, runId, periodId, fromWorkgroupId, toWorkgroupId,
                    nodeId, componentId, studentWorkId, annotationType);

            JSONArray annotationsJSONArray = new JSONArray();

            // loop through all the annotations
            for (int a = 0; a < annotations.size(); a++) {
                Annotation annotationObject = annotations.get(a);

                // get the JSON representation of the annotation and add to annotationsJSONArray
                annotationsJSONArray.put(annotationObject.toJSON());
            }
            try {
                result.put("annotations", annotationsJSONArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        // write the result to the response
        try {
            PrintWriter writer = response.getWriter();
            writer.write(result.toString());
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = "/teacher/data")
    public void postWISETeacherData(
            HttpServletResponse response,
            @RequestParam(value = "workgroupId", required = true) Integer workgroupId,
            @RequestParam(value = "runId", required = true) Integer runId,
            @RequestParam(value = "annotations", required = true) String annotations
    ) {
        System.out.println("postWISETeacherData");
        System.out.println("workgroupId=" + workgroupId);
        System.out.println("runId=" + runId);
        System.out.println("annotations=" + annotations);

        JSONObject result = new JSONObject();

        try {
            User signedInUser = ControllerUtil.getSignedInUser();

            Run run = runService.retrieveById(new Long(runId));

            User owner = run.getOwner();
            Set<User> sharedOwners = run.getSharedowners();

            if (owner.equals(signedInUser) || sharedOwners.contains(signedInUser)) {

                // handle POST'ed annotations
                JSONArray annotationsJSONArray = new JSONArray(annotations);
                if (annotationsJSONArray != null) {
                    JSONArray annotationsResultJSONArray = new JSONArray();
                    for (int a = 0; a < annotationsJSONArray.length(); a++) {
                        try {
                            JSONObject annotationJSONObject = annotationsJSONArray.getJSONObject(a);
                            String requestToken = annotationJSONObject.getString("requestToken");

                            Annotation annotation = vleService.saveAnnotation(
                                    annotationJSONObject.isNull("id") ? null : annotationJSONObject.getInt("id"),
                                    annotationJSONObject.isNull("runId") ? null : annotationJSONObject.getInt("runId"),
                                    annotationJSONObject.isNull("periodId") ? null : annotationJSONObject.getInt("periodId"),
                                    annotationJSONObject.isNull("fromWorkgroupId") ? null : annotationJSONObject.getInt("fromWorkgroupId"),
                                    annotationJSONObject.isNull("toWorkgroupId") ? null : annotationJSONObject.getInt("toWorkgroupId"),
                                    annotationJSONObject.isNull("nodeId") ? null : annotationJSONObject.getString("nodeId"),
                                    annotationJSONObject.isNull("componentId") ? null : annotationJSONObject.getString("componentId"),
                                    annotationJSONObject.isNull("studentWorkId") ? null : annotationJSONObject.getInt("studentWorkId"),
                                    annotationJSONObject.isNull("type") ? null : annotationJSONObject.getString("type"),
                                    annotationJSONObject.isNull("data") ? null : annotationJSONObject.getString("data"),
                                    annotationJSONObject.isNull("clientSaveTime") ? null : annotationJSONObject.getString("clientSaveTime"));


                            // before returning saved Annotation, strip all fields except id, responseToken, and serverSaveTime to minimize response size
                            JSONObject savedAnnotationJSONObject = new JSONObject();
                            savedAnnotationJSONObject.put("id", annotation.getId());
                            savedAnnotationJSONObject.put("requestToken", requestToken);
                            savedAnnotationJSONObject.put("serverSaveTime", annotation.getServerSaveTime().getTime());
                            annotationsResultJSONArray.put(savedAnnotationJSONObject);

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    result.put("annotations", annotationsResultJSONArray);
                }
            }
        } catch (ObjectNotFoundException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // write the result to the response
        try {
            PrintWriter writer = response.getWriter();
            writer.write(result.toString());
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
