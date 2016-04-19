
vmsdir = $(pkgdatadir)/vms
vms_DATA = \
	pkg/vms/manifest.json \
	pkg/vms/app.css \
	pkg/vms/index.html \
	$(NULL)

vmsdebugdir = $(debugdir)$(vmsdir)
vmsdebug_DATA = \
	pkg/vms/bundle.js \
	$(vms_DATA) \
	$(NULL)

vms_BUNDLE = \
	pkg/vms/src/app.js \
	$(NULL)

pkg/vms/bundle.js: $(vms_BUNDLE)
	echo ===== Building pkg/vms/bundle.js. Add Webpack here
	cp pkg/vms/src/app.js pkg/vms/bundle.js
#	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/jsbundle $@ $^

CLEANFILES += \
	pkg/vms/bundle.js \
	$(NULL)

EXTRA_DIST += \
	pkg/vms/bundle.js \
	$(vms_DATA) \
	$(NULL)
