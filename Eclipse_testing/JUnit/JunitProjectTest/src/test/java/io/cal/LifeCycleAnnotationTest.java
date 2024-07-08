package io.cal;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.*;
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LifeCycleAnnotationTest {

	LifeCycleAnnotation m;
	@BeforeAll
	void beforeAll() {
		System.out.println("this is will run before all methods");
	}
	@AfterAll
	void afterAll() {
		System.out.println("this will run at last");
	}
	
	@AfterEach
	void cleanup() {
		System.out.println("clean up now");
	}
	//@Test
	void testsquare() {
		
	}
	
	void testcube() {
		int expected =125;
		int actual = m.cube(5);
		assertEquals(expected,actual,"pass");
	}
	@Nested
	class testPositivenumber{
		//@Test
		void testPositiveno() {
			int expected = 2;
			int actual = m.positive(2,-2);
			assertEquals(expected, actual);
		}
		@Test
		void testNegativeeno() {
			int expected = -2;
			int actual = m.positive(2,-2);
			assertEquals(expected,actual,()-> "should retrun a -ve value");
		}
	}
	

}
