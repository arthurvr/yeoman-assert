/*global it, describe, before, beforeEach */
'use strict';
var path = require('path');
var assert = require('assert');
var yoAssert = require('./');

var noop = function () {};

describe('generators.assert', function () {
  beforeEach(function () {
    process.chdir(path.join(__dirname, './fixtures'));
  });

  it('extend native assert module', function () {
    yoAssert.implement(yoAssert, assert);
  });

  describe('.file()', function () {
    it('accept a file that exists', function () {
      assert.doesNotThrow(yoAssert.file.bind(yoAssert, 'testFile'));
    });

    it('accept an array of files all of which exist', function () {
      assert.doesNotThrow(yoAssert.file.bind(yoAssert, ['testFile', 'testFile2']));
    });

    it('reject a file that does not exist', function () {
      assert.throws(yoAssert.file.bind(yoAssert, 'etherealTestFile'));
    });

    it('reject multiple files one of which does not exist', function () {
      assert.throws(yoAssert.file.bind(yoAssert, ['testFile', 'intangibleTestFile']));
    });

    // DEPRECATED

    it('accept a file with content that matches reg', function () {
      assert.doesNotThrow(yoAssert.file.bind(yoAssert, 'testFile', /Roses are red/));
    });

    it('reject a file with content does not match reg', function () {
      assert.throws(yoAssert.file.bind(yoAssert, 'testFile', /Roses are blue/));
    });
  });

  describe('.noFile()', function () {
    it('accept a file that does not exist', function () {
      assert.doesNotThrow(yoAssert.noFile.bind(yoAssert, 'etherealTestFile'));
    });

    it('accept an array of files all of which do not exist', function () {
      assert.doesNotThrow(
        yoAssert.noFile.bind(yoAssert, ['etherealTestFile', 'intangibleTestFile']));
    });

    it('reject a file that exists', function () {
      assert.throws(yoAssert.noFile.bind(yoAssert, 'testFile'));
    });

    it('reject an array of files one of which exists', function () {
      assert.throws(
        yoAssert.noFile.bind(yoAssert, ['testFile', 'etherealTestFile']));
    });
  });

  describe('.files()', function () {  // DEPRECATED
    it('accept an array of files all of which exist', function () {
      assert.doesNotThrow(
        yoAssert.files.bind(yoAssert, ['testFile', 'testFile2']));
    });

    it('reject an array of multiple files one of which exists', function () {
      assert.throws(
        yoAssert.files.bind(yoAssert, ['testFile', 'etherealTestFile']));
    });

    it('accept an array of file/regex pairs when each file\'s content matches the corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are red/],
        ['testFile2', /Violets are blue/]
      ];
      assert.doesNotThrow(yoAssert.files.bind(yoAssert, arg));
    });

    it('reject an array of file/regex pairs when one file\'s content does not matches the corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are red/],
        ['testFile2', /Violets are orange/]
      ];
      assert.throws(yoAssert.files.bind(yoAssert, arg));
    });
  });

  describe('.fileContent()', function () {
    it('accept a file and regex when the file content matches the regex', function () {
      assert.doesNotThrow(yoAssert.fileContent.bind(yoAssert, 'testFile', /Roses are red/));
    });

    it('accept a file and string when the file contains the string', function () {
      assert.doesNotThrow(yoAssert.fileContent.bind(yoAssert, 'testFile', 'Roses are red'));
    });

    it('reject a file and regex when the file content does not match the regex', function () {
      assert.throws(yoAssert.fileContent.bind(yoAssert, 'testFile', /Roses are blue/));
    });

    it('reject a file and string when the file content does not contain the string', function () {
      assert.throws(yoAssert.fileContent.bind(yoAssert, 'testFile', 'Roses are blue'));
    });

    it('accept an array of file/regex pairs when each file\'s content matches the corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are red/],
        ['testFile2', /Violets are blue/]
      ];
      assert.doesNotThrow(yoAssert.fileContent.bind(yoAssert, arg));
    });

    it('reject an array of file/regex pairs when one file\'s content does not matches the corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are red/],
        ['testFile2', /Violets are orange/]
      ];
      assert.throws(yoAssert.fileContent.bind(yoAssert, arg));
    });
  });

  describe('.noFileContent()', function () {
    it('accept a file and regex when the file content does not match the regex', function () {
      assert.doesNotThrow(yoAssert.noFileContent.bind(yoAssert, 'testFile', /Roses are blue/));
    });

    it('accept a file and string when the file content does not contain the string', function () {
      assert.doesNotThrow(yoAssert.noFileContent.bind(yoAssert, 'testFile', 'Roses are blue'));
    });

    it('reject a file and regex when the file content matches the regex', function () {
      assert.throws(yoAssert.noFileContent.bind(yoAssert, 'testFile', /Roses are red/));
    });

    it('reject a file and string when the file content contain the string', function () {
      assert.throws(yoAssert.noFileContent.bind(yoAssert, 'testFile', 'Roses are red'));
    });

    it('accept an array of file/regex pairs when each file\'s content does not match its corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are green/],
        ['testFile2', /Violets are orange/]
      ];
      assert.doesNotThrow(yoAssert.noFileContent.bind(yoAssert, arg));
    });

    it('reject an array of file/regex pairs when one file\'s content does matches its corresponding regex', function () {
      var arg = [
        ['testFile', /Roses are red/],
        ['testFile2', /Violets are orange/]
      ];
      assert.throws(yoAssert.noFileContent.bind(yoAssert, arg));
    });
  });

  describe('.implement()', function () {
    beforeEach(function () {
      this.subject = { foo: noop, bar: noop };
      this.interfaceSome = ['foo'];
      this.interfaceComplete = ['foo', 'bar'];
      this.interfaceMore = ['foo', 'yo'];
    });

    it('pass if an object implement an interface', function () {
      assert.doesNotThrow(yoAssert.implement.bind(yoAssert, this.subject, this.interfaceSome));
      assert.doesNotThrow(yoAssert.implement.bind(yoAssert, this.subject, this.interfaceComplete));
    });

    it('fails if methods are missing', function () {
      assert.throws(yoAssert.implement.bind(yoAssert, this.subject, this.interfaceMore));
    });

    it('allow interface to be an object (using its object.keys)', function () {
      var interfacePass = { foo: noop };
      var interfaceFail = { yop: noop };
      assert.doesNotThrow(yoAssert.implement.bind(yoAssert, this.subject, interfacePass));
      assert.throws(yoAssert.implement.bind(yoAssert, this.subject, interfaceFail));
    });

    it('when object is passed in, it only check it implements the methods', function () {
      var expected = { foo: noop, yop: 'some arg' };
      assert.doesNotThrow(yoAssert.implement.bind(yoAssert, this.subject, expected));
    });
  });

  describe('.notImplement()', function () {
    beforeEach(function () {
      this.subject = { foo: noop, bar: noop };
      this.interfaceSome = ['foo'];
    });

    it('pass if an object doesn\'t implement an interface', function () {
      assert.doesNotThrow(yoAssert.notImplement.bind(yoAssert, this.subject, ['stuff']));
    });

    it('fails if methods are present', function () {
      assert.throws(yoAssert.notImplement.bind(yoAssert, this.subject, ['foo']));
    });
  });
});
