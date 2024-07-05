package FirstTest;
import static io.restassured.RestAssured.baseURI;
import static io.restassured.RestAssured.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import org.json.simple.JSONObject;
import org.testng.annotations.Test;
public class JSONSchemaValidator {
	@Test
	public void testGET1() {
		baseURI="http://localhost:8888";
		given().get("/users").
		then().
		assertThat().body(matchesJsonSchemaInClasspath("schema.json"));
	}

}
