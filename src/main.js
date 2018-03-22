import './styles.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { coingrabber } from "../src/coingrabber.js";
//import { **insert prototype name** } from './coingrabber.js';

$(document).ready(function() {

  var startDate;
  var endDate;
  var coinTest = "";
  var fiatType;
  var fiatAmount;

  $("#buy-date").attr("max", todayDate());
  $("#sell-date").attr("max", todayDate());

  $(".crypto-search-btn").change(function() {
    console.log("hello");
  })
