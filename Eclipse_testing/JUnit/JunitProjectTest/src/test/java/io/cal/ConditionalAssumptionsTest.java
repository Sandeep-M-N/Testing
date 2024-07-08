package io.cal;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledOnOs;
import org.junit.jupiter.api.condition.OS;

class ConditionalAssumptionsTest {

	@Test
    @EnabledOnOs(OS.LINUX)
	void testOperatingSys() {
		System.out.println("I am on windows 11");
	}
	void testValue() {
		
		ConditionalAssumptions c1 = new ConditionalAssumptions();
		boolean val =false;
		assumeTrue(val);
		int expected =10;
		int actual = c1.value();
		assertEquals(expected,actual);
		
	}
	

}
