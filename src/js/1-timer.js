import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerInterval = null; 

const startBtn = document.querySelector("[data-start]");
const datetimePicker = document.querySelector("#datetime-picker");
 startBtn.disabled = true;

function addLeadingZero(value){
    return String(value).padStart(2,0);
}

function updateTimerDisplay(d,h,m,s){
    document.querySelector("[data-days]").textContent = d;
    document.querySelector("[data-hours]").textContent = addLeadingZero(h);
    document.querySelector("[data-minutes]").textContent = addLeadingZero(m);
    document.querySelector("[data-seconds]").textContent =addLeadingZero(s);
}

function convertMs(ms) {
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const days = Math.floor(ms/day);
const hours = Math.floor((ms % day)/hour);
const minutes = Math.floor(((ms % day) % hour)/minute);
const seconds = Math.floor((((ms % day)% hour)% minute)/second);
return {days, hours, minutes, seconds }
}

flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date ()){
        userSelectedDate = null;
        startBtn.disabled = true;
         iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }else{
       userSelectedDate = selectedDate;
        startBtn.disabled = false;
    }
  }
});

startBtn.addEventListener('click',()=>{
    if(!userSelectedDate) return;

    startBtn.disabled = true;
     datetimePicker.disabled = true;

     timerInterval = setInterval(() =>{
        const now = new Date();
        const timeLeft = userSelectedDate - now;

        if (timeLeft <= 0){
            clearInterval(timerInterval);
            updateTimerDisplay(0, 0, 0, 0);
            datetimePicker.disabled = false;
            startBtn.disabled = false;
            return
        }
        const {days, hours, minutes, seconds}= convertMs(timeLeft);
        updateTimerDisplay(days, hours, minutes, seconds);
     }, 1000);
})
