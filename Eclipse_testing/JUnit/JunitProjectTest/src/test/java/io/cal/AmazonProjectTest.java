package io.cal;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class AmazonProjectTest {

	@Test
	void testAmazonTagLine() {
		String expected = "Spend less. smile more";
		String actual = "Spend less. smile more";
		assertEquals(expected,actual);
		assertSame(expected, actual,"Expected result should match with actual result");
	}

}
