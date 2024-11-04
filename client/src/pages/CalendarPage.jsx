import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTasksRequest } from "../api/tasks";
import "../../public/css/callendar.module.css";
import esLocale from "@fullcalendar/core/locales/es";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasksRequest();
        const tasks = response.data;

        const calendarEvents = tasks.map((task) => ({
          title: task.title,
          start: task.date,
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-5 h-[calc(100vh-100px)]">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        height={"100%"}
        events={events}
        locale={esLocale}
      />
    </div>
  );
};

export default CalendarPage;
