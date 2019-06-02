

export  function buttonClassFunction(aqi,home){
    let buttonClass="round"
    if (home){
    if (aqi <= 50){
        buttonClass = "round green home"
      }
      else if (aqi => 51  && aqi <=100){
        buttonClass = "round yellow home"
      }
      else if (aqi => 101  && aqi <=150){
        buttonClass = "round orange home"
      }
      else if (aqi => 151  && aqi <=200){
        buttonClass = "round red home"
      }
      else if (aqi => 201  && aqi <=300){
        buttonClass = "round purple home"
      }
      else if (aqi => 301 ) {
        buttonClass = "round gonna-die home"
      }
      return buttonClass
    }
    else{
        if (aqi <= 50){
            buttonClass = "round green"
          }
          else if (aqi > 50  && aqi <=100){
            buttonClass = "round yellow"
          }
          else if (aqi > 100  && aqi <=150){
            buttonClass = "round orange"
          }
          else if (aqi > 150  && aqi <=200){
            buttonClass = "round red"
          }
          else if (aqi > 200 && aqi <=300){
            buttonClass = "round purple"
          }
          else if (aqi > 300) {
            buttonClass = "round gonna-die"
          }
          return buttonClass

    }
}
//not gonna work yet 
// export function doPollutantsExist(){

// if (json.data.iaqi.o3){
//   this.setState({
//     o3:json.data.iaqi.o3.v,
//   })
// }
// if (json.data.iaqi.so2){
//   this.setState({
//     so2:json.data.iaqi.so2.v,

//   })
// }
// if (json.data.iaqi.pm10){
//   this.setState({
//     pm10:json.data.iaqi.pm10.v
//   })

// }
// if (json.data.iaqi.pm25){
//   this.setState({
//     pm25:json.data.iaqi.pm25.v,
//   })
// }

// if (json.data.iaqi.no2){
//   this.setState({
//     no2:json.data.iaqi.no2.v,
//   })
// }
// }