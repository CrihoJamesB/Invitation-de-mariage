

Ride request widget documentation
Introduction
Yango can be integrated into your apps and websites for order

ing a car to a pre-set address. This allows customers to order a car (for example, to your office) in just a few clicks.

You can add this function for ordering cars in the following ways:

Using widgets:  for site web pages. Place a ready-made widget on your website page and specify the destination address in its settings. After clicking the button on the widget, the user will be redirected to the Yango site or Yango application to confirm the order.

Using API: for apps. Use API requests to obtain the necessary details of the trip, then create a link which redirects the user to the Yango app.

Using widgets
Yango widgets make it easier for your site's users to get a ride to an address you can specify. Widgets contain a button that when clicked opens the Yango site, displaying car order confirmation.

Badge
Button
Custom layout




Call a taxi
<div class="ya-taxi-widget"
data-clid="yourclid" 
data-apikey="951a2f8d262547d8a5fc63f70cf54552" 
data-use-location="true"
data-point-b="25.2527999878,55.3643989563"
data-custom-layout="true"
data-ref="yoursitename"
data-lang="en"
data-proxy-url="https://yango.go.link/route?start-lat={start-lat}&start-lon={start-lon}&end-lat={end-lat}&end-lon={end-lon}&adj_adgroup=widget&ref={ref}&adj_t=vokme8e_nd9s9z9&lang=ru&adj_deeplink_js=1&utm_source=widget&adj_fallback=https%3A%2F%2Fyango.com%2Fen_int%2Forder%2F%3Fgfrom%3D{start-lon}%2C{start-lat}%26gto%3D{end-lon}%2C{end-lat}%26ref%3D{ref}"
>
<div data-description="true"></div>
<div><a href="#" data-link="true">Call a taxi</a></div>
<div data-disclaimer="true"></div>
</div>
You can configure the pick up address, destination, appearance, and more for the widget. These parameters are described in the Widget settings section.

Attention. Resource yastatic.net/taxi-widget/ya-taxi-widget.js returns the widget code using utf-8. If your site uses a different encoding, add the charset= "UTF-8" parameter to the widget code:
<script src="//yastatic.net/taxi-widget/ya-taxi-widget.js" charset="UTF-8"></script>
If you have any questions, please use the feedback form
Installing a widget
To add the Yango widget to your site:

Add the DIV element to the body of your site page with the widget parameters , for example:

<div class="ya-taxi-widget"
data-ref="yoursitename"
data-clid="API_CLID_(optional)"
data-size="s" 
data-theme="normal" 
data-title="Get a ride"
data-description="Dubai International Airport" 
data-use-location="true" 
data-app="2187871" 
data-point-b="25.2527999878,55.3643989563" 
data-proxy-url="https://yango.go.link/route?start-lat={start-lat}&start-lon={start-lon}&end-lat={end-lat}&end-lon={end-lon}&adj_adgroup=widget&ref={ref}&adj_t=vokme8e_nd9s9z9&lang=ru&adj_deeplink_js=1&utm_source=widget&adj_fallback=https%3A%2F%2Fyango.com%2Fen_int%2Forder%2F%3Fgfrom%3D{start-lon}%2C{start-lat}%26gto%3D{end-lon}%2C{end-lat}%26ref%3D{ref}"
...
>
</div>
On the same page, add the widget script:

<script src="//yastatic.net/taxi-widget/ya-taxi-widget.js"></script>
Widget settings

Widget parameters



The Yango widget can contain the following parameters:

<div class="ya-taxi-widget"
    data-size="xs|s"
    data-theme="normal|dark|action"
    data-title="widget name"
    data-description="widget description"
    data-point-а="<longitude>,<latitude>"
    data-point-b="<longitude>,<latitude>"
    data-use-location="<true|false>"
    data-proxy-url="Proxy URL"
    data-clid="User ID"
    data-apikey="API key"
    data-ref="Your site name"
    data-nonce="nonce attribute"
    data-zoom="map scale"
    data-custom-layout="<true|false>"
    …>
</div>


data-size

   Widget type. Possible values:

   xs is a badge (small button).

   s is a button.

data-theme

   Widget theme. Possible values:

normal for standard theme. Default value.

dark for dark theme. Currently, the dark theme is only supported for the data-size="xs" badge.

action for yellow theme. At the moment the yellow theme is only supported for the data-size="xs" badge    and data-size="s" button.

data-title

   Name of the widget, for example “Get a ride”.

data-description

   Widget description, such as “Dubai International Airport”. Optional parameter.

data-point-a

   Departure point coordinates in the format: <longitude>,<latitude>. Optional parameter.

data-point-b

   Departure point coordinates in the format: <longitude>,<latitude>.

data-use-location

   Indicates whether the user's location is being used. Possible values:

   false means use of the user's location data is disabled. Default value.

   true means the value for the data-point-a parameter will not be taken into account; the departure point will be obtained from the user's location data.

data-nonce

   Nonce attribute.

data-custom-layout

   Feature of the custom layout of a widget.

Widget link

The data-proxy url parameter determines how users are redirected to the Yango site.

data-proxy url

The URL to go to the Yango site. Example of this URL:

data-proxy-url="https://yango.go.link/route?start-lat={start-lat}&start-lon={start-lon}&end-lat={end-lat}&end-lon={end-lon}&adj_adgroup=widget&ref={ref}&adj_t=vokme8e_nd9s9z9&lang=ru&adj_deeplink_js=1&utm_source=widget&adj_fallback=https%3A%2F%2Fyango.com%2Fen_int%2Forder%2F%3Fgfrom%3D{start-lon}%2C{start-lat}%26gto%3D{end-lon}%2C{end-lat}%26ref%3D{ref}
You do not need to put the coordinates in the link. The {start-lat}, {start-lon}, {end-lat} and {end-lon} parameters automatically receive values from the widget settings.

If the action takes place from a mobile device that does not have the Yango application installed, the user will be redirected to the app store of the corresponding platform (Google Play/App Store).



For more information, see the link parameters and redirect logic in the Forming links section.

How the trip cost is displayed

To display the trip cost in the widget, use the following parameters:

data-clid

   Client ID for authorization. To get an ID, text us via email on integration-support@yango.com.

data-apikey

   API key for authorization. To get a key, text us via email on integration-support@yango.com.

Widget custom layout
Widget with custom layout (data-custom-layout="true") allows you to display information without using styles. In this case, the widget content can be placed in other page elements. To do this, set the following options for page elements:

data-title="true" is the title element.

data-link="true" is the link element. We do not recommend setting links in iframe or using the target="_blank" parameter, since some browsers may block the link from opening in a new window.

data-description="true" is the subtitle element, or the cost of the trip.

data-disclaimer="true" is a warning with text about the cost of sending a car out. When using a widget, this text is displayed automatically. For widgets with custom layout, this text must be displayed next to it with a link.

Attention. Approximate cost of the route specified with Economy class fare. The price may differ due to demand and availability of cars.


Using the API
Using the Yango API you can get:

Trip information, displaying the cost and time of the upcoming trip.

Region information, displaying Yango rates and services in the specified region.

After you receive the data you need, generate a link which redirects the user to the Yango website or application to confirm the trip.

API access is provided by a key. To get a key, text us on integration-support@yango.com

The key can be transmitted in one of the following ways:

In the request header. To do this, add the value of the resulting key to the  YaTaxi-Api-Key: <key value> header. Recommended method.

In the request parameter. To do this, add the value of the key received to the   apikey=<key value> parameter.

Attention. We do not recommend this method, since the token value may be saved in logs.

Trip information
Use this request for getting detailed information about trips.
JSON and protobuf response formats are supported. To choose the response format, send the optional Accept header:

Accept: application/json is the response in JSON format. Default value.

Accept: application/x-protobuf is the response in protobuf format.

Request syntax

GET  https://taxi-routeinfo.taxi.yandex.net/taxi_info?clid=<clid>&apikey=<apikey>&rll=<lon,lat~lon,lat>&class=<class_str>&req=<req_str>
Arguments:

clid is the client ID. To get an ID, To get a key, text us on integration-support@yango.com. Required parameter.

apikey is the API key (ancor on Using the API). To get a key, text us on integration-support@yango.com. This parameter can be used instead of the YaTaxi-Api-Key header. If the YaTaxi-Api-Key header is not passed, the apikey  parameter is mandatory.

Attention. We do not recommend this method, since the token value might be saved in logs.

rll is the departure and destination coordinates. Required parameter. Argument format:

{departure point longitude},{departure point latitude}~{destination longitude},{destination latitude}
You can also specify just the departure or destination point in the parameter:

{departure or destination longitude},{departure or destination latitude}
In this case, the response will contain a limited set of fields and will only indicate the pickup fee including the surcharge.

To find out whether your region is supported by Yango, use the Region information request.

class is the fare rate. Optional parameter. The request may specify multiple fares. In this case, the fare names in the parameter are separated by commas. Acceptable values:

- econom: “Economy”.

- business: “Comfort”.

- comfortplus: “Comfort+”.

- minivan: “Minivan”.

- vip: “Business”.

The default class is econom.

In some regions, not all of these fare classes are available. If multiple fares were given in the request, and some of them are not supported, the response will contain only information about the supported fares. If only unsupported fares were specified in the request, the response will contain code 200 and an empty string.

req is the client's requirements for the car. Optional parameter. The request may specify multiple requirements. In this case, the values in the parameter are separated by commas. Acceptable values:

- yellowcarnumber for a car with yellow number plates.

- nosmoking for a driver that does not smoke.

- childchair for the driver to have a child seat in the car.

- bicycle for transporting bicycles.

- conditioner for the car to have an air conditioner.

- animaltransport for transporting animals.

- universal for a station wagon.

- check for where a receipt of payment is required.

- ski for transporting skis or snowboards.

- waiting_in_transit for time spent idle whilst travelling.

- meeting_arriving for meeting the rider with a sign.

- luggage for paid transportation of baggage.



lang for the response language. Optional parameter. Possible values:

- en for English

- uk for Ukrainian.

- kk for Kazakh.

- az for Azerbaijani.

- ka for Georgian.

- hy for Armenian.

- ky for Kyrgyz.

- lv for Latvian.

- ro for Romanian.

- uz for Uzbek.

- et for Estonian.

- fr for French.

- ru for Russian.



Response field description

Responses may contain the following fields:

Field	Description	Format
currency	Payment currency. May contain the following values:
KZT for Kazakhstani tenge.
AMD for Armenian dram.
GEL for Georgian lari.
AZN for Azerbaijani manat.
UAH for Ukrainian hryvnia.
BYN for new Belarusian ruble.
BYR for old Belarusian ruble.
KGS for Kyrgyzstani som.
EUR for euro.
MDL for Moldovan leu.
UZS for Uzbek so'm.
RUB for Russian ruble.
The list of supported currencies can be expanded later.

String.
distance	The approximate distance of the trip, in meters.
Note. This parameter is only available when the start and end points of the route were specified in the request.
Floating-point number.
options	List of trip options. May contain the following fields:
class_name
class_level
class_text
min_price
price
waiting_time

Array.
class_name	Name of the fare class in English.	String.
class_text	Name of the fare class in the requested language.	String.
class_level	Numeric fare ID.	Number.
min_price	
The pickup fee without a surcharge.

When displaying this information, you must also show a warning in accordance with the ARI terms of use.

Floating-point number.
price	
Fare. If only the pick up point or destination was specified in the request, this parameter will contain the pickup fee with a surcharge.

When displaying this information, you must also show a warning in accordance with the API terms of use.

Floating-point number.
price_text	Text description of the cost of the trip. Includes the value from the price field and currency. The currency in this field depends on the lang parameter in the query.	String.
waiting_time	Car arrival time in seconds.
Note. This parameter may be omitted if there are currently no available cars for the specified route.
Floating-point number.
time	Travel time in seconds.
Note. This parameter is only available when the start and end points of the route were specified in the request.
Floating-point number.
Response in protobuf format

If the request was sent with the  Accept: application/x-protobuf header, the response will be the  TaxiInfo message.

To decode the protobuf response, use the following protocol description:

message TaxiOption
{
required double price = 1;
required double min_price = 2;
optional double waiting_time = 3;
required string class_name = 4;
required string class_text = 5;
required int32 class_level = 6;
required string price_text = 7;
}
message TaxiInfo
{
repeated TaxiOption options = 1;
required string currency = 2;
optional double distance = 3;
optional double time = 4;
}

The names of all the fields in the protobuf response will be the same as the response in json format.

Example of a request for a single fare

GET https://taxi-routeinfo.taxi.yandex.net/taxi_info?rll=25.2527999878,55.3643989563~26,55&clid=t...3&apikey=q...3
The response to this request is as follows:

{
"currency": "EUR",
"distance": 61529.771101536542,
"options": [
{
"class_level": 50,
"class_name": "econom",
"class_text": "Economy",
"min_price": 5,
"price": 15,
"price_text": "15 EUR.",
"waiting_time": 203.98798614740372
}
],
"time": 3816.9397069215775
}
Example request for multiple fares

Fare classes “Economy” and “Business” are specified in the request, but the destination is not specified:

GET https://taxi-routeinfo.taxi.yandex.net/taxi_info?rll=25.2527999878,55.3643989563&clid=t...3&apikey=q...3&class=econom,vip&req=check,yellowcarnumber


The response to this request is as follows:

{
"currency": "EUR",
"options":[
{
"class_level": 50,
"class_name": "econom",
"class_text": "Economy",
"min_price": 9,
"price": 25,
"price_text": "from 9 EUR.",
"waiting_time": 203.98798614740372
},
{
"class_level": 90,
"class_name": "vip",
"class_text": "Business",
"min_price": 19,
"price": 25,
"price_text": "from 19 EUR.",
"waiting_time": 708.15764345228672
}
],
"time": 3816.9397069215775
}
Possible response codes

The response to this request may contain the following response codes:

200: request completed successfully.

400: request parameters were omitted or incorrect.

403: authorization error. Invalid API key or client ID values.

500: internal server error.

In case of code errors 400 and 403, the body of the response will contain a message about the error.

Region information
This request is used for receiving information about Yango fares and services in the specified region.

Request syntax

 GET https://taxi-routeinfo.taxi.yandex.net/zone_info?clid=<clid>&apikey=<apikey>&rll=<lon,lat>

Arguments:

clid is the client ID. To get an ID, text us on integration-support@yango.com. Required parameter.

apikey is the API key (ancor api). To get a key, text us on integration-support@yango.com. This parameter can be used instead of the YaTaxi-Api-Key header. If the YaTaxi-Api-Key header is not passed, the apikey parameter is mandatory.

Attention. We do not recommend this method, since the token value might be saved in logs.
ll is the coordinates of the region. Required parameter. Argument format:

{region longitude},{region latitude}\



Response field description

Responses may contain the following fields:

Field	Description	Format
tariffs	List of fare classes supported in the region. If the specified region is not supported by Yandex Go the array will be empty.	Array.
class	Class ID. Possible values:
econom: “Economy”.
business: “Comfort”.
comfortplus: “Comfort+”.
minivan: “Minivan”.
vip: “Business”.
String.
supported_requirements	List of services provided in the region.	Array.
name	ID of the service. Possible values:
yellowcarnumber for a car with yellow number plates.
nosmoking for a driver that does not smoke.
childchair for the driver to have a child seat in the car.
bicycle for transporting bicycles.
conditioner for the car to have an air conditioner.
animaltransport for transporting animals.
universal for a station wagon.
check for where a receipt of payment is required.
ski for transporting skis or snowboards.
waiting_in_transit for time spent idle whilst travelling.
meeting_arriving for meeting the rider with a sign.
luggage for paid transportation of baggage.
String.
Example query

GET https://taxi-routeinfo.taxi.yandex.net/zone_info?ll=37.589569560,55.733780&clid=t...t3&apikey=q...3
Example response

{
    "tariffs": [
        {
            "class": "econom", 
            "supported_requirements": [
               {
                  "name": "conditioner" 
               },
               {
                    "name": "childchair"
               },
               ...
            ]
        }, …
    ]
}


Possible response codes

The response to this request may contain the following response codes:

200: request completed successfully.

400: request parameters were omitted or incorrect.

403: authorization error. Invalid API key or client ID values.

500: internal server error.

In case of code errors 400 and 403, the body of the response will contain a message about the error.

Generating links
To redirect a user to a website or mobile app, you need to create a link that contains the trip parameters. After clicking on this link, the user will see the route of the trip and will be able to order a taxi.

By default the link leads to the app if the user has it installed. If the application is not installed, the link will follow to webview

You can use links to collect order statistics. To receive statistics on your orders, write to  integration-support@yango.com.

Link format

https://yango.go.link/route?start-lat={start-lat}&start-lon={start-lon}&end-lat={end-lat}&end-lon={end-lon}&ref={ref}&adj_t=vokme8e_nd9s9z9&lang=ru&adj_deeplink_js=1&adj_fallback=https%3A%2F%2Fyango.com%2Fen_int%2Forder%2F%3Fgfrom%3D{start-lon}%2C{start-lat}%26gto%3D{end-lon}%2C{end-lat}%26ref%3D{ref}
Parameters:



start-lat

Departure point latitude. Optional parameter. Used with the start-lon parameter.

start-lon

Departure point longitude. Optional parameter. Used with the start-lat parameter.

end-lat

Destination latitude. Optional parameter. Used with the end-lon parameter.

end-lon

Destination longitude. Optional parameter. Used with the end-lat parameter.

level

Numeric fare ID. Optional parameter. This parameter is only available when the departure and destination points for the journey are indicated.

ref

Source ID. This parameter is used for passing on your affiliate program ID, or the name of your resource if you don't have an ID. The value in this parameter must contain Latin characters only. For example, mywebsite.com can have the ID,  mywebsitecom.

adj_t,  adj_deeplink_js & adj_fallback

Technical parameters. These are necessary for the correct work of the widget





Note.

The departure and destination point parameters are optional.

We do not recommend setting links in iframe or using the target="_blank" parameter, since some browsers may block the link from opening in a new window.

For iOS, links are supported in Universal Links format.

Feedback
If something went wrong or you have questions about using Yango widgets, please write to support:


Privacy Policy
App Permissions
Yango GCC © 2025
Yango is an informational service and not a transportation or taxi services provider. Transportation services are provided by third parties. Any statements displayed are for informational purposes only and do not constitute an offer or promise. Where a relevant badge is displayed, the following is applicable: App Store is a trademark of Apple Inc., registered in the U.S. and other countries. Google Play and the Google Play logo are trademarks of Google LLC.