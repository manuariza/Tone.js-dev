define(["helper/Basic", "Tone/source/OmniOscillator", "helper/Offline",
	"helper/SourceTests", "helper/OscillatorTests", "helper/OutputAudio", "helper/CompareToFile"],
function(BasicTests, OmniOscillator, Offline, SourceTests, OscillatorTests, OutputAudio, CompareToFile) {

	describe("OmniOscillator", function(){

		//run the common tests
		BasicTests(OmniOscillator);
		SourceTests(OmniOscillator);
		OscillatorTests(OmniOscillator);

		it("matches a file", function(){
			return CompareToFile(function(){
				const osc = new OmniOscillator(220, "fmsquare").toMaster();
				osc.start(0.1).stop(0.2);
			}, "omniOscillator.wav", 100);
		});

		context("Sound", function(){

			it("makes a sound", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator();
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to square", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "square");
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to pulse", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "pulse");
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to pwm", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "pwm");
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to fm", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "fmsquare");
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to am", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "amsine");
					osc.toMaster();
					osc.start();
				});
			});

			it("makes a sound when set to fat", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "fatsawtooth");
					osc.toMaster();
					osc.start();
				});
			});

			it("can switch type after playing", function(){
				return OutputAudio(function(){
					var osc = new OmniOscillator(440, "amsine");
					osc.toMaster();
					osc.start();
					osc.type = "fmsine";
				});
			});

		});

		context("Type", function(){

			it("can get and set the type", function(){
				var osc = new OmniOscillator({
					"type" : "sawtooth",
				});
				expect(osc.type).to.equal("sawtooth");
				osc.dispose();
			});

			it("handles various types", function(){
				var osc = new OmniOscillator();
				var types = ["triangle3", "sine", "pulse", "pwm", "amsine4", "fatsquare2", "fmsawtooth"];
				for (var i = 0; i < types.length; i++){
					osc.type = types[i];
					expect(osc.type).to.equal(types[i]);
				}
				osc.dispose();
			});

			it("throws an error if invalid type is set", function(){
				var osc = new OmniOscillator();
				expect(function(){
					osc.type = "invalid";
				}).to.throw(Error);
				osc.dispose();
			});

			it("can set extended types", function(){
				var osc = new OmniOscillator();
				osc.type = "sine5";
				expect(osc.type).to.equal("sine5");
				osc.type = "triangle2";
				expect(osc.type).to.equal("triangle2");
				osc.dispose();
			});

			it("can set the modulation frequency only when type is pwm", function(){
				var omni = new OmniOscillator();
				omni.type = "pwm";
				expect(function(){
					omni.modulationFrequency.value = 0.2;
				}).to.not.throw(Error);
				omni.type = "pulse";
				expect(function(){
					omni.modulationFrequency.value = 0.2;
				}).to.throw(Error);
				omni.dispose();
			});

			it("can set the modulation width only when type is pulse", function(){
				var omni = new OmniOscillator();
				omni.type = "pulse";
				expect(function(){
					omni.width.value = 0.2;
				}).to.not.throw(Error);
				omni.type = "sine";
				expect(function(){
					omni.width.value = 0.2;
				}).to.throw(Error);
				omni.dispose();
			});

			it("can be set to an FM oscillator", function(){
				var omni = new OmniOscillator();
				omni.set({
					"type" : "fmsquare2",
					"modulationIndex" : 2
				});
				expect(omni.type).to.equal("fmsquare2");
				expect(omni.modulationIndex.value).to.equal(2);
				omni.dispose();
			});

			it("can be set to an AM oscillator", function(){
				var omni = new OmniOscillator();
				omni.set("type", "amsquare");
				omni.modulationType = "sawtooth2";
				expect(omni.type).to.equal("amsquare");
				expect(omni.modulationType).to.equal("sawtooth2");
				omni.dispose();
			});

			it("can be set to an FatOscillator", function(){
				var omni = new OmniOscillator({
					"type" : "fatsquare2",
					"count" : 4,
					"spread" : 25
				});
				expect(omni.type).to.equal("fatsquare2");
				expect(omni.count).to.equal(4);
				expect(omni.spread).to.equal(25);
				omni.dispose();
			});

			it("can set a FM oscillator with partials", function(){
				var omni = new OmniOscillator({
					"detune" : 4,
					"type" : "fmcustom",
					"partials" : [2, 1, 2, 2],
					"phase" : 120,
					"volume" : -2,
					"harmonicity" : 2
				});
				expect(omni.volume.value).to.be.closeTo(-2, 0.01);
				expect(omni.detune.value).to.be.closeTo(4, 0.01);
				expect(omni.phase).to.be.closeTo(120, 0.01);
				expect(omni.type).to.be.equal("fmcustom");
				expect(omni.partials).to.deep.equal([2, 1, 2, 2]);
				expect(omni.harmonicity.value).be.closeTo(2, 0.01);
				omni.dispose();
			});

			it("setting/getting values when the wrong type is set has no effect", function(){
				var omni = new OmniOscillator(440, "sine");
				omni.set({
					"modulationIndex" : 4,
					"harmonicity" : 3,
				});
				omni.spread = 40;
				expect(omni.spread).to.be.undefined;
				omni.count = 5;
				expect(omni.count).to.be.undefined;
				omni.modulationType = "sine";
				expect(omni.modulationType).to.be.undefined;
				expect(omni.modulationIndex).to.be.undefined;
				expect(omni.harmonicity).to.be.undefined;
				omni.dispose();
			});
		});
	});
});
