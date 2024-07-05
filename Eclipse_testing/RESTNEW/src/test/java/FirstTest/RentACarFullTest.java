package FirstTest;
import static io.restassured.RestAssured.baseURI;
import static io.restassured.RestAssured.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import org.json.simple.JSONObject;
import org.testng.Assert;
import org.testng.annotations.Test;
import static org.hamcrest.Matchers.*;

import java.util.HashMap;
import java.util.Map;

import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class RentACarFullTest {

	public void HomePageApiTest() {
		Response response = get("http://localhost:8888");
		System.out.println(response.getStatusCode());
		System.out.println(response.getTime());
		System.out.println(response.getBody().asString());
		System.out.println(response.getStatusLine());
		System.out.println(response.getHeader("content-type"));
		
		int statuscode = response.getStatusCode();
		
		Assert.assertEquals(statuscode, 200); 
	}
	//@Test
	public void GETApi() {
		baseURI="http://localhost:8888";
		given().get("users").then().statusCode(200).body("[0].username",equalTo("sandeep")).log().all();

		
	}
	// put & post request
	//@Test
	public void POSTApi() {
		Map<String, Object> map = new HashMap<String, Object>();
		JSONObject request = new JSONObject(map);
		request.put("name","Santos");
		request.put("job","Trainer");

		System.out.println(request.toJSONString());

		baseURI="http://localhost:8888";

		given().header("Content-Type","application/json").contentType(ContentType.JSON).accept(ContentType.JSON).
		body(request.toJSONString()).post("/users").then().statusCode(201).log().all();
	}
	//@Test
	public void PUTApi() {
		JSONObject request = new JSONObject();

		request.put("username","basil");
		request.put("userpassword","basilbasil");

		System.out.println(request.toJSONString());

		baseURI="http://localhost:8888/";

		given().header("Content-Type","application/json").contentType(ContentType.JSON).accept(ContentType.JSON).
		body(request.toJSONString()).put("users/1").then().statusCode(200).log().all();
	}
	//@Test
	public void PATCHApi() {
		JSONObject request = new JSONObject();

		request.put("username","tempuser");
		request.put("password","1234567890");

		System.out.println(request.toJSONString());

		baseURI="http://localhost:8888/";

		given().header("Content-Type","application/json").contentType(ContentType.JSON).accept(ContentType.JSON).
		body(request.toJSONString()).patch("users/3").then().statusCode(200).log().all();
	}
	@Test
	public void DELETEApi() {
		baseURI="http://localhost:8888/";
		when().delete("contact/aa18").then().statusCode(200).log().all();
	}
	
}
