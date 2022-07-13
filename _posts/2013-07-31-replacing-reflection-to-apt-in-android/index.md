---
layout: post
date: 2013-07-31 10:00:00 +09:00
permalink: /2013-07-31-replacing-reflection-to-apt-in-android
disqusUrl: http://engineering.vcnc.co.kr/2013/07/replacing-reflection-to-apt-in-android/

title: 안드로이드 클라이언트 Reflection 극복기
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  비트윈 팀은 비트윈 안드로이드 클라이언트(이하 안드로이드 클라이언트)를 가볍고 반응성 좋은 애플리케이션으로 만들기 위해 노력하고 있습니다.
  이 글에서는 간결하고 유지보수하기 쉬운 코드를 작성하고자 했던 노력을 소개하고자 합니다.
  또한 그 과정에서 발생한 Java Reflection 성능저하를 해결하기 위해 시도했던 여러 방법을 공유하도록 하겠습니다.

tags: ['Android', 'Reflection', 'Dexmaker', 'APT', 'Code Generating']

authors:
  - name: 'Hugh Namkung'
		facebook: https://www.facebook.com/namkhoh
		link: https://www.facebook.com/namkhoh
---

비트윈 팀은 비트윈 안드로이드 클라이언트(이하 안드로이드 클라이언트)를 가볍고 반응성 좋은 애플리케이션으로 만들기 위해 노력하고 있습니다.
이 글에서는 간결하고 유지보수하기 쉬운 코드를 작성하기 위해 Reflection을 사용했었고 그로 인해 성능 이슈가 발생했던 것을 소개합니다.
또한 그 과정에서 발생한 Reflection 성능저하를 해결하기 위해 시도했던 여러 방법을 공유하도록 하겠습니다.

## 다양한 형태의 데이터

Java를 이용해 서비스를 개발하는 경우 [POJO]로 서비스에 필요한 다양한 모델 클래스들을 만들어 사용하곤 합니다. 안드로이드 클라이언트 역시 모델을 클래스 정의해 사용하고 있습니다.
하지만 서비스 내에서 데이터는 정의된 클래스 이외에도 다양한 형태로 존재합니다. 안드로이드 클라이언트에서 하나의 데이터는 아래와 같은 형태로 존재합니다.

- JSON: 비트윈 서비스에서 HTTP API는 JSON 형태로 요청과 응답을 주고 받고 있습니다.
- Thrift: TCP를 이용한 채팅 API는 Thrift를 이용하여 프로토콜을 정의해 서버와 통신을 합니다.
- [ContentValues]: 안드로이드에서는 Database 에 데이터를 저장할 때, 해당 정보는 ContentValues 형태로 변환돼야 합니다.
- [Cursor]: Database에 저장된 정보는 Cursor 형태로 접근가능 합니다.
- POJO: 변수와 Getter/Setter로 구성된 클래스 입니다. 비지니스 로직에서 사용됩니다.

코드 전반에서 다양한 형태의 데이터가 주는 혼란을 줄이기 위해 항상 POJO로 변환한 뒤 코드를 작성하기로 했습니다.

### 다양한 데이터를 어떻게 상호 변환할 것 인가?

JSON 같은 경우는 Parsing 후 Object로 변환해 주는 라이브러리([Gson], [Jackson JSON])가 존재하지만 다른 형태(Thrift, Cursor..)들은 만족스러운 라이브러리가 존재하지 않았습니다.
그렇다고 모든 형태에 대해 변환하는 코드를 직접 작성하면 필요한 경우 아래와 같은 코드를 매번 작성해줘야 합니다.
이와 같이 작성하는 경우 Cursor에서 원하는 데이터를 일일이 가져와야 합니다.

```java
@Override
public void bindView(View view, Context context, Cursor cursor) {
	final ViewHolder holder = getViewHolder(view);

	final String author = cursor.getString("author");
	final String content = cursor.getString("content");
	final Long timeMills = cursor.getLong("time");
	final ReadStatus readStatus = ReadStatus.fromValue(cursor.getString("readStatus"));
	final CAttachment attachment = JSONUtils.parseAttachment(cursor.getLong("createdTime"));

	holder.authorTextView.setText(author);
	holder.contentTextView.setText(content);
	holder.readStatusView.setReadStatus(readStatus);
	...
}
```

하지만 각 형태의 필드명(Key)이 서로 같도록 맞춰주면 각각의 Getter와 Setter를 호출해 형태를 변환해주는 Utility Class를 제작할 수 있습니다.

```java
@Override
public void bindView(View view, Context context, Cursor cursor) {
	final ViewHolder holder = getViewHolder(view);
	Message message = ReflectionUtils.fromCursor(cursor, Message.class);
	holder.authorTextView.setText(message.getAuthor());
	holder.contentTextView.setText(message.getContent());
	holder.readStatusView.setReadStatus(message.getReadStatus());
	...
}
```

이런 식으로 코드를 작성하면 이해하기 쉽고, 모델이 변경되는 경우에도 유지보수가 비교적 편하다는 장점이 있습니다.
따라서 필요한 데이터를 POJO로 작성하고 다양한 형태의 데이터를 POJO로 변환하기로 했습니다.
서버로부터 받은 JSON 혹은 Thrift객체는 자동으로 POJO로 변환되고 POJO는 다시 ContentValues 형태로 DB에 저장됩니다.
DB에 있는 데이터를 화면에 보여줄때는 Cursor로부터 데이터를 가져와서 POJO로 변환 후 적절한 가공을 하여 View에 보여주게 됩니다.

![DataConvert]

<figcaption>POJO 형태로 여러 데이터 변환필요</figcaption>

## Reflection 사용과 성능저하

처음에는 [Reflection]을 이용해 여러 데이터를 POJO로 만들거나 POJO를 다른 형태로 변환하도록 구현했습니다.
대상 Class의 newInstance/getMethod/invoke 함수를 이용해 객체 인스턴스를 생성하고 Getter/Setter를 호출하여 값을 세팅하거나 가져오도록 했습니다.
앞서 설명한 `ReflectionUtils.fromCursor(cursor, Message.class)`를 예를 들면 아래와 같습니다.

```java
public T fromCursor(Cursor cursor, Class clazz) {
	T instance = (T) clazz.newInstance();
	for (int i=0; i<cursor.getColumnCount(); i++) {
	final String columnName = cursor.getColumnName(i);
	final Class<?> type = clazz.getField(columnName).getType();
	final Object value = getValueFromCursor(cursor, type);
	final Class<?>[] parameterType = { type };
	final Object[] parameter = { value };
	Method m = clazz.getMethod(toSetterName(columnName), parameterType);
	m.invoke(instance, value);
	}
	return instance;
}
```

Reflection을 이용하면 동적으로 Class의 정보(필드, 메서드)를 조회하고 호출할 수 있기 때문에 코드를 손쉽게 작성할 수 있습니다.
하지만 Reflection은 [튜토리얼 문서]에서 설명된 것처럼 성능저하 문제가 있습니다.
한두 번의 Relfection 호출로 인한 성능저하는 무시할 수 있다고 해도,
필드가 많거나 필드로 Collection을 가진 클래스의 경우에는 수십 번이 넘는 Reflection이 호출될 수 있습니다.
실제로 이 때문에 안드로이드 클라이언트에서 종종 반응성이 떨어지는 경우가 발생했습니다.
특히 CursorAdapter에서 Cursor를 POJO로 변환하는 코드 때문에 ListView에서의 스크롤이 버벅이기도 했습니다.

## Bytecode 생성

Reflection 성능저하를 해결하려고 처음으로 선택한 방식은 Bytecode 생성입니다.
[Google Guice][googleguice] 등의 다양한 자바 프로젝트에서도 Bytecode를 생성하는 방식으로 성능 문제를 해결합니다.
다만 안드로이드의 Dalvik VM의 경우 일반적인 JVM의 Bytecode와는 스펙이 다릅니다.
이 때문에 기존의 자바 프로젝트에서 Bytecode 생성에 사용되는 [CGLib] 같은 라이브러리 대신 [Dexmaker]를 이용하여야 했습니다.

### CGLib

CGLib는 Bytecode를 직접 생성하는 대신 `FastClass`, `FastMethod` 등 펀리한 클래스를 이용할 수 있습니다.
`FastClass`나 `FastMethod`를 이용하면 내부적으로 알맞게 Bytecode를 만들거나
이미 생성된 Bytecode를 이용해 비교적 빠른 속도로 객체를 만들거나 함수를 호출 할 수 있습니다.
```java
public T create() {
	return (T) fastClazz.newInstance();
}

public Object get(Object target) {
	result = fastMethod.invoke(target, (Object[]) null);
}

public void set(Object target, Object value) {
	Object[] params = { value };
	fastMethod.invoke(target, params);
}
```

### Dexmaker

하지만 Dexmaker는 Bytecode 생성 자체에 초점이 맞춰진 라이브러리라서 `FastClass`나 `FastMethod` 같은 편리한 클래스가 존재하지 않습니다.
결국, 다음과 같이 Bytecode 생성하는 코드를 직접 한땀 한땀 작성해야 합니다.

```java
public DexMethod generateClasses(Class<?> clazz, String clazzName){
	dexMaker.declare(declaringType, ..., Modifier.PUBLIC, TypeId.OBJECT, ...);
	TypeId<?> targetClassTypeId = TypeId.get(clazz);
	MethodId invokeId = declaringType.getMethod(TypeId.OBJECT, "invoke", TypeId.OBJECT, TypeId.OBJECT);
	Code code = dexMaker.declare(invokeId, Modifier.PUBLIC);

	if (isGetter == true) {
		Local<Object> insertedInstance = code.getParameter(0, TypeId.OBJECT);
		Local instance = code.newLocal(targetClassTypeId);
		Local returnValue = code.newLocal(TypeId.get(method.getReturnType()));
		Local value = code.newLocal(TypeId.OBJECT);
		code.cast(instance, insertedInstance);
		MethodId executeId = ...
		code.invokeVirtual(executeId, returnValue, instance);
		code.cast(value, returnValue);
		code.returnValue(value);
	} else {
		...
	}

	// constructor
	Code constructor = dexMaker.declare(declaringType.getConstructor(), Modifier.PUBLIC);
	Local<?> thisRef = constructor.getThis(declaringType);
	constructor.invokeDirect(TypeId.OBJECT.getConstructor(), null, thisRef);
	constructor.returnVoid();
}
```

Dexmaker를 이용한 방식을 구현하여 동작까지 확인했으나, 다음과 같은 이유로 실제 적용은 하지 못했습니다.

1. Bytecode를 메모리에 저장하는 경우, 프로세스가 종료된 이후 실행 시 Bytecode를 다시 생성해 애플리케이션의 처음 실행성능이 떨어진다.
2. Bytecode를 스토리지에 저장하는 경우, 원본 클래스가 변경됐는지를 매번 검사하거나 업데이트마다 해당 스토리지를 지워야 한다.
3. 더 좋은 방법이 생각났다.

## Annotation Processor

최종적으로 저희가 선택한 방식은 컴파일 시점에 형태변환 코드를 자동으로 생성하는 것입니다.
Reflection으로 접근하지 않아 속도도 빠르고, Java코드가 미리 작성돼 관리하기도 편하기 때문입니다.
POJO 클래스에 알맞은 Annotation을 달아두고, [APT]를 이용해 Annotation이 달린 모델 클래스에 대해 형태변환 코드를 자동으로 생성했습니다.

형태 변환이 필요한 클래스에 Annotation(`@GenerateAccessor`)을 표시합니다.

```java
@GenerateAccessor
public class Message {
	private Integer id;
	private String content;

	public Integer getId() {
		return id;
	}
	...
}
```

javac에서 APT 사용 옵션과 [Processor]를 지정합니다. 그러면 Annotation이 표시된 클래스에 대해 Processor의 작업이 수행됩니다.
Processor에서 코드를 생성할 때에는 StringBuilder 등으로 실제 코드를 일일이 작성하는 것이 아니라
[Velocity]라는 template 라이브러리를 이용합니다.
Processor는 아래와 같은 소스코드를 생성합니다.

```java
public class Message$$Accessor implements Accessor<kr.co.vcnc.binding.performance.Message> {

	public kr.co.vcnc.binding.performance.Message create() {
		return new kr.co.vcnc.binding.performance.Message();
	}

	public Object get(Object target, String fieldName) throws IllegalArgumentException {
		kr.co.vcnc.binding.performance.Message source = (kr.co.vcnc.binding.performance.Message) target;
		switch(fieldName.hashCode()) {
		case 3355: {
			return source.getId();
		}
		case -1724546052: {
			return source.getContent();
		}
		...
		default:
			throw new IllegalArgumentException(...);
		}
	}

	public void set(Object target, String fieldName, Object value) throws IllegalArgumentException {
		kr.co.vcnc.binding.performance.Message source = (kr.co.vcnc.binding.performance.Message) target;
		switch(fieldName.hashCode()) {
		case 3355: {
			source.setId( (java.lang.Integer) value);
			return;
		}
		case -1724546052: {
			source.setContent( (java.lang.String) value);
			return;
		}
		...
		default:
			throw new IllegalArgumentException(...);
		}
	}
}
```

여기서 저희가 정의한 Accessor는 객체를 만들거나 특정 필드의 값을 가져오거나 세팅하는 인터페이스로, 객체의 형태를 변환할 때 이용됩니다.
get,set 메서드는 필드 이름의 hashCode 값을 이용해 해당하는 getter,setter를 호출합니다.
hashCode를 이용해 switch-case문을 사용한 이유는 Map을 이용하는 것보다 성능상 이득이 있기 때문입니다.
단순 메모리 접근이 Java에서 제공하는 HashMap과 같은 자료구조 사용보다 훨씬 빠릅니다.
APT를 이용해 변환코드를 자동으로 생성하면 여러 장점이 있습니다.

1. Reflection을 사용하지 않고 Method를 직접 수행해서 빠르다.
2. Bytecode 생성과 달리 애플리케이션 처음 실행될 때 코드 생성이 필요 없고 만들어진 코드가 APK에 포함된다.
3. Compile 시점에 코드가 생성돼서 Model 변화가 바로 반영된다.

APT를 이용한 Code생성으로 Reflection 속도저하를 해결할 수 있습니다.
이 방식은 애플리케이션 반응성이 중요하고 상대적으로 Reflection 속도저하가 큰 안드로이드 라이브러리에서 최근 많이 사용하고 있습니다. ([AndroidAnnotations], [ButterKnife], [Dagger])

## 성능 비교

다음은 Reflection, Dexmaker, Code Generating(APT)를 이용해 JSONObject를 Object로 변환하는 작업을 50번 수행한 결과입니다.

![PerformanceChart]

<figcaption>성능 비교 결과</figcaption>

이처럼 최신 OS 버전일수록 Reflection의 성능저하가 다른 방법에 비해 상대적으로 더 큽니다.
반대로 Dexmaker의 생성 속도는 빨라져 APT 방식과의 성능격차는 점점 작아집니다.
하지만 역시 **APT를 통한 Code 생성이 모든 환경에서 가장 좋은 성능을 보입니다.**

## 마치며

서비스 모델을 반복적으로 정의하지 않으면서 변환하는 방법을 알아봤습니다.
그 과정에서 Reflection 의 속도저하, Dexmaker 의 단점도 설명해 드렸고 결국 APT가 좋은 해결책이라고 판단했습니다.
저희는 이 글에서 설명해 드린 방식을 추상화해 Binding이라는 라이브러리를 만들어 사용하고 있습니다.
Binding은 POJO를 다양한 JSON, Cursor, ContentValues등 다양한 형태로 변환해주는 라이브러리입니다.
뛰어난 확장성으로 다양한 형태의 데이터로 변경하는 플러그인을 만들어서 사용할 수 있습니다.

```java
Message message = Bindings.for(Message.class).bind().from(AndroidSources.cursor(cursor));
Message message = Bindings.for(Message.class).bind().from(JSONSources.jsonString(jsonString));
String jsonString = Bindings.for(Message.class).bind(message).to(JSONTargets.jsonString());
```

위와 같이 Java상에 존재할 수 있는 다양한 타입의 객체에 대해 일종의 데이터 Binding 기능을 수행합니다.
Binding 라이브러리도 기회가 되면 소개해드리겠습니다. 윗글에서 궁금하신 점이 있으시거나 잘못된 부분이 있으면 답글을 달아주시기 바랍니다.
감사합니다.

[pojo]: http://en.wikipedia.org/wiki/Plain_Old_Java_Object 'POJO'
[reflection]: http://en.wikipedia.org/wiki/Reflection_(computer_programming) 'Reflection'
[튜토리얼 문서]: http://docs.oracle.com/javase/tutorial/reflect/ 'Java Reflection Tutorial'
[cglib]: http://cglib.sourceforge.net/ 'CGLib'
[dexmaker]: https://code.google.com/p/dexmaker/ 'Dexmaker'
[apt]: http://docs.oracle.com/javase/1.5.0/docs/guide/apt/GettingStarted.html 'APT'
[processor]: http://docs.oracle.com/javase/6/docs/api/javax/annotation/processing/Processor.html 'Processor'
[velocity]: http://velocity.apache.org/ 'Velocity'
[androidannotations]: http://androidannotations.org/ 'AndroidAnnotations'
[butterknife]: http://jakewharton.github.io/butterknife/ 'ButterKnife'
[dagger]: http://square.github.io/dagger/ 'Dagger'
[contentvalues]: http://developer.android.com/reference/android/content/ContentValues.html 'ContentValues'
[gson]: https://code.google.com/p/google-gson/ 'Gson'
[jackson json]: http://jackson.codehaus.org/ 'Jackson JSON'
[cursor]: http://developer.android.com/reference/android/database/Cursor.html 'Cursor'
[googleguice]: https://code.google.com/p/google-guice/
[dataconvert]: ./android-reflection-to-codegen-data_convert.png '데이터 형태 변환'
[performancechart]: ./android-reflection-to-codegen-performance_chart.png '성능차트'
