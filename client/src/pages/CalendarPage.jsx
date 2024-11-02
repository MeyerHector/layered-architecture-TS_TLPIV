import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTasksRequest } from "../api/tasks"; 
import "../../public/css/callendar.module.css"; 

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

        const calendarEvents = tasks.map(task => ({
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
    <div className="p-5"> 
      <h1 className="text-2xl font-bold mb-4">Calendario de Tareas</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events} 
        className="fullcalendar"
      />
    </div>
  );
};

export default CalendarPage;
