function updateUI(element, value) {
	$(element).html(value)
}

function resetStats() {
	$('.data').each(function() {
		$(this).html('0.00')
	})

	$('#generation').html('0')
	$('#goal').html('Navigate track to completion.')
}

$(document).ready(function() {
	$('#track-select').change(function() {
		simulation.changeTrack(Number($(this).val()))
	})

	$('#train-select').change(function () {
		switch (Number($(this).val())) {
			case 0: simulation.loadNoTrained()
				break
			case 1: simulation.loadSemiTrained()
				break
			case 2: simulation.loadFullyTrained()
				break
		}
	})

	$('#size-select').change(function () {
		simulation.changeGenerationSize(Number($(this).val()))
	})

	$('#mut-select').change(function () {
		simulation.changeMutationRate(Number($(this).val()))
	})
})


