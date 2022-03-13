define(["Tone/instrument/NoiseSynth", "helper/Basic",
	"helper/InstrumentTests", "helper/CompareToFile"],
function(NoiseSynth, Basic, InstrumentTest, CompareToFile) {

	describe("NoiseSynth", function(){

		Basic(NoiseSynth);
		InstrumentTest(NoiseSynth, undefined, {
			envelope : {
				release : 0.2,
				decay : 0.1,
				sustain : 0.5
			}
		});

		it("matches a file", function(){
			return CompareToFile(function(){
				const synth = new NoiseSynth().toMaster();
				synth.triggerAttack();
			}, "noiseSynth.wav", 50);
		});

		context("API", function(){

			it("can get and set noise type", function(){
				var noiseSynth = new NoiseSynth();
				noiseSynth.noise.type = "pink";
				expect(noiseSynth.noise.type).to.equal("pink");
				noiseSynth.dispose();
			});

			it("can get and set envelope attributes", function(){
				var noiseSynth = new NoiseSynth();
				noiseSynth.envelope.attack = 0.24;
				expect(noiseSynth.envelope.attack).to.equal(0.24);
				noiseSynth.dispose();
			});

			it("can be constructed with an options object", function(){
				var noiseSynth = new NoiseSynth({
					"envelope" : {
						"sustain" : 0.3
					}
				});
				expect(noiseSynth.envelope.sustain).to.equal(0.3);
				noiseSynth.dispose();
			});

			it("can get/set attributes", function(){
				var noiseSynth = new NoiseSynth();
				noiseSynth.set({
					"envelope.decay" : 0.24
				});
				expect(noiseSynth.get().envelope.decay).to.equal(0.24);
				noiseSynth.dispose();
			});

		});
	});
});
